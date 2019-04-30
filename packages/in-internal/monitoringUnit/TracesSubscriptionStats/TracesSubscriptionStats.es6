import { combineLatest } from 'reactive-observables';
import React, { Fragment } from 'react';

import { getTimeWindowBasedMetricAggregation } from 'in-stores/metric/metric';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { getDropwizardWithContext } from 'in-internal/monitoringUnit/dataRetrieval';
import LoadingIndicator from 'in-components/LoadingIndicator';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import Button from 'in-new-components/Button';
import connectTo from 'in-hoc/connectTo';

const cols = [
  {
    title: 'Customer',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.label;
      }
    }
  },
  {
    title: 'Total Traces Subscriptions',
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.tracesMetric;
      },
      getContent: number.detailed
    }
  },
  {
    title: 'Total Single Trace Subscriptions',
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.traceMetric;
      },
      getContent: number.detailed
    }
  }
];

export default function TracesSubscriptionReportWrapper(props) {
  return (
    <DashboardSection>
      <TracesSubscriptionReport {...props} />
    </DashboardSection>
  );
}

const TracesSubscriptionReport = connectTo(
  {
    rows: getDropwizardWithContext('entity.label:ui-backend*')
  },
  class TracesSubscriptionReport extends React.Component {
    static displayName = 'AnalyzeFilterBasicDialog';

    constructor(props) {
      super(props);

      this.state = {
        currentData: [],
        isRunning: false,
        currentRowIndexToGrapDataFor: -1
      };
    }

    componentDidUpdate(prevProps, prevState) {
      if (
        this.state.currentRowIndexToGrapDataFor >= 0 &&
        this.state.currentRowIndexToGrapDataFor !== prevState.currentRowIndexToGrapDataFor
      ) {
        this.fetchMetricForIndex(this.state.currentRowIndexToGrapDataFor);
      } else if (this.state.currentRowIndexToGrapDataFor === -1) {
        this.stopFetching();
      }
    }

    componentWillUnmount() {
      this.stopFetching();
    }

    stopFetching = () => {
      if (this.metricSubscription) {
        this.metricSubscription.dispose();
        this.metricSubscription = null;
      }
      clearTimeout(this.timeoutHandle);
    };

    fetchMetricForIndex = index => {
      this.stopFetching();

      const snapshotId = this.props.rows[index].dropwizard.get('id');
      this.metricSubscription = combineLatest([
        getTimeWindowBasedMetricAggregation({
          snapshotId,
          metric: 'metrics.meters.established.subscriptions: TracesSubscribeEvent',
          timeWindowAggregation: 'sum'
        }),
        getTimeWindowBasedMetricAggregation({
          snapshotId,
          metric: 'metrics.meters.active.subscriptions: TraceSubscribeEvent',
          timeWindowAggregation: 'sum'
        })
      ]).subscribe(([tracesMetricResult, traceMetricResult]) => {
        this.setData(index, tracesMetricResult, traceMetricResult);
      });

      clearTimeout(this.timeoutHandle);
      this.timeoutHandle = setTimeout(() => {
        this.stopFetching();
        this.setData(index, -1, -1);
      }, 5000);
    };

    setData = (index, tracesMetric, traceMetric) => {
      const currentData = this.state.currentData.concat([
        {
          key: this.props.rows[index].dropwizard.get('id'),
          label: this.props.rows[index].container.get('label'),
          tracesMetric,
          traceMetric
        }
      ]);
      if (this.state.currentRowIndexToGrapDataFor >= this.props.rows.length - 1) {
        this.setState({ currentData, currentRowIndexToGrapDataFor: -1, isRunning: false });
      } else {
        this.setState({ currentData, currentRowIndexToGrapDataFor: this.state.currentRowIndexToGrapDataFor + 1 });
      }
    };

    render() {
      const { rows } = this.props;
      if (rows.length === 0) {
        return <LoadingIndicator type="dark" />;
      }

      const { isRunning, currentData } = this.state;

      return (
        <Fragment>
          {!isRunning && (
            <Button
              onClick={() => {
                this.setState({
                  currentData: [],
                  isRunning: true,
                  currentRowIndexToGrapDataFor: 0
                });
              }}
            >{`Run report for ${rows.length} customers`}</Button>
          )}
          {isRunning && (
            <Button
              onClick={() => {
                this.setState({
                  isRunning: false,
                  currentRowIndexToGrapDataFor: -1
                });
              }}
            >
              Stop report
            </Button>
          )}
          <h3>
            {currentData.length} / {rows.length}
          </h3>
          <Table cols={cols} rows={currentData} maxItemsPerPage={50} />
        </Fragment>
      );
    }
  }
);
