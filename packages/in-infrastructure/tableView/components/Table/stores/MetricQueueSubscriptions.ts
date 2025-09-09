/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */
import { Observable } from '@instana/observables';
import { Snapshot } from '@instana/types';

//@ts-expect-error
import { getMetric } from 'in-stores/metric';

interface Column {
  columnDefinition: {
    title: string;
    type: string;
    typeArgs: {
      getContent: (d: number) => number;
      getMetricName: () => string;
      getSnapshotId: () => string;
      getTimeWindowAggregation: () => string;
    };
  };
  columnIndex: number;
  comparator: (a: number, b: number) => number;
  refreshContent: () => void;
  requiresContentRefresh: boolean;
  subscription: Observable<any>;
  value: number | null | undefined;
  isLoading: boolean;
}

interface RowConfig {
  isSelected: boolean;
  key: string;
  snapshot: Snapshot;
  snapshotId: string;
}

interface Row {
  columns: Column[];
  expanded: boolean;
  key: string;
  marked: boolean;
  mutationCount: number;
  rowConfig: RowConfig;
}

interface RequestForSubscription {
  snapshotId: string;
  metric: string;
  column: Column;
  row: Row;
  emitRawDataChange: () => void;
  timeWindowAggregation: string;
  forceTimeWindowAggregation: string;
}

export default class MetricQueueSubscriptions {
  public requestQueue: RequestForSubscription[];
  public activeSubscriptions: Set<RequestForSubscription>;
  public MAX_QUEUE_SIZE: number;
  public isProcessing: boolean;

  constructor(QUEUE_SIZE = 125) {
    this.requestQueue = []; // stores things waiting to be processed
    this.activeSubscriptions = new Set(); // stores metrics being processed
    this.MAX_QUEUE_SIZE = QUEUE_SIZE; // sets max queue size
    this.isProcessing = false; // sets boolean that manages queue processing
  }

  addMetricSubscription(request: RequestForSubscription) {
    this.requestQueue.push(request);
    this.processQueue();
  }

  processQueue() {
    if (this.isProcessing) return;

    this.isProcessing = true;

    // Try finally to avoid while loop throwing errors while processing
    // Bob helped with finding a queueing logic here to avoid deadlocking
    try {
      while (this.requestQueue.length > 0 && this.activeSubscriptions.size < this.MAX_QUEUE_SIZE) {
        const request = this.requestQueue.shift();
        if (request) this.processMetricSubscription(request);
      }
    } finally {
      this.isProcessing = false;
    }
  }

  processMetricSubscription(request: RequestForSubscription) {
    const { snapshotId, metric, column, row, emitRawDataChange, timeWindowAggregation, forceTimeWindowAggregation } =
      request;

    this.activeSubscriptions.add(request);

    const observable = getMetric({
      snapshotId,
      metric,
      timeWindowAggregation,
      forceTimeWindowAggregation
    }) as Observable<any>;

    const setColumn = (value: number | null | undefined) => {
      column.value = value;
      column.requiresContentRefresh = true;
      row.mutationCount++;
      emitRawDataChange();
    };

    column.isLoading = true;
    observable.once(
      (value: any) => {
        if (column.value !== value) {
          setColumn(value);
        } else if (value == null) {
          setColumn(undefined);
        }
        this.activeSubscriptions.delete(request);

        this.processQueue();
      },
      () => {
        setColumn(undefined);
      }
    );
  }

  getQueue() {
    return this.requestQueue;
  }

  getActiveSubscriptions() {
    return this.activeSubscriptions;
  }

  clearQueue() {
    this.requestQueue = [];
    this.activeSubscriptions.clear();
  }
}
