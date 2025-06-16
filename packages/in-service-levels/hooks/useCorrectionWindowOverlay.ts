/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { useState } from 'react';

import useSloTimeWindowContext from 'in-service-levels/hooks/useSloTimeWindowContext';
import { MetricDataSeries } from 'in-components/Chart/types';

interface MetricsWithId {
  id: string;
  metrics: MetricDataSeries;
}

function getOverlappingSections(periods: MetricsWithId[]): MetricDataSeries {
  const overlaps: MetricDataSeries = [];
  for (let i = 0; i < periods.length; i++) {
    for (let j = i + 1; j < periods.length; j++) {
      const { metrics: aMetrics } = periods[i];
      const { metrics: bMetrics } = periods[j];
      const [[aStartX], [aEndX]] = bMetrics;
      const [[bStartX], [bEndX]] = aMetrics;
      if (aStartX <= bEndX && bStartX <= aEndX) {
        const overlapStart = Math.max(aStartX, bStartX);
        const overlapEnd = Math.min(aEndX, bEndX);
        overlaps.push([overlapStart, -Infinity], [overlapEnd, -Infinity]);
      }
    }
  }

  return overlaps;
}

export interface Group {
  id: string;
  name: string;
  metrics: MetricDataSeries;
}

export type OnLegendItemToggle = (id: string) => void;

export default function useCorrectionWindowOverlay(): {
  onLegendItemToggle: OnLegendItemToggle;
  groups: Group[];
  overlappingSections: MetricDataSeries;
} {
  const [toggledCorrectionWindows, setToggledCorrectionWindows] = useState<string[]>([]);

  const { correctionData } = useSloTimeWindowContext();

  const correctionWindows = correctionData?.correction?.correctionWindows ?? [];
  const configurations = correctionData?.configurations ?? [];

  const metrics: MetricsWithId[] = correctionWindows
    .filter(({ correctionConfigs: [id] = [] }) => !toggledCorrectionWindows.includes(id))
    .map(({ from, to, correctionConfigs: [id] = [] }) => ({
      id,
      metrics: [
        [from!, -Infinity],
        [to!, -Infinity]
      ]
    }));

  const groups = correctionWindows.reduce<string[]>((acc, window) => {
    const [id] = window.correctionConfigs ?? [];
    if (!acc.includes(id)) {
      acc.push(id);
    }
    return acc;
  }, []);

  const onLegendItemToggle = (id: string) => {
    const [, configId] = id.split('correctionWindow-');
    if (!configId) return;
    setToggledCorrectionWindows(toggledCorrectionWindows => {
      if (toggledCorrectionWindows.includes(configId)) {
        return toggledCorrectionWindows.filter(id => id !== configId);
      } else {
        return [...toggledCorrectionWindows, configId];
      }
    });
  };

  const overlappingSections = getOverlappingSections(metrics);

  return {
    onLegendItemToggle,
    overlappingSections,
    groups: groups.map(id => ({
      name: configurations.find(configuration => configuration.id === id)?.name!,
      id,
      metrics: metrics.filter(m => m.id === id).flatMap(({ metrics }) => metrics)
    }))
  };
}
