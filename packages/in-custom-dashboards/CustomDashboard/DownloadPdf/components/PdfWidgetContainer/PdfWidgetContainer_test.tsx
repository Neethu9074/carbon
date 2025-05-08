/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import PdfWidgetContainer from 'in-custom-dashboards/CustomDashboard/DownloadPdf/components/PdfWidgetContainer/PdfWidgetContainer';
import { CustomDashboardContext } from 'in-custom-dashboards/CustomDashboard/CustomDashboardContext';

test('renders PdfWidgetContainer with context', () => {
  const widgets = [
    {
      id: 'DCpjFb9Kii1As8Qg',
      title: '',
      width: 3,
      height: 13,
      x: 0,
      y: 243,
      type: 'chart',
      config: {
        shareMaxAxisDomain: false,
        y1: {
          formatter: 'percentage.detailed',
          renderer: 'line',
          metrics: [
            {
              lastValue: false,
              color: '',
              compareToTimeShifted: false,
              aggregation: 'MEAN',
              label: '',
              source: 'INFRASTRUCTURE_METRICS',
              type: 'clrRuntimePlatform',
              metricPath: ['.NET', '.NET App', 'GC'],
              formatter: 'number.detailed',
              unit: 'percentage',
              metric: 'mem.time_in_gcn',
              timeShift: 0,
              tagFilterExpression: {
                logicalOperator: 'AND',
                elements: [],
                type: 'EXPRESSION'
              },
              allowedCrossSeriesAggregations: [],
              metricLabel: 'GC time',
              crossSeriesAggregation: 'MEAN'
            }
          ],
          formatterSelected: false
        },
        y2: {
          formatter: 'number.detailed',
          renderer: 'line',
          metrics: [
            {
              lastValue: false,
              color: '',
              compareToTimeShifted: false,
              aggregation: 'MEAN',
              label: '',
              source: 'INFRASTRUCTURE_METRICS',
              type: 'clrRuntimePlatform',
              metricPath: ['.NET', '.NET App', 'GC'],
              formatter: 'number.detailed',
              unit: 'number',
              metric: 'mem.gen0GC',
              timeShift: 0,
              tagFilterExpression: {
                logicalOperator: 'AND',
                elements: [],
                type: 'EXPRESSION'
              },
              allowedCrossSeriesAggregations: [],
              metricLabel: 'Generation 0 GC',
              crossSeriesAggregation: 'MEAN'
            }
          ]
        },
        type: 'TIME_SERIES'
      }
    }
  ];

  const exportWidgetToPdf = jest.fn();

  render(
    <CustomDashboardContext.Provider value={{ widgets, exportWidgetToPdf }}>
      <PdfWidgetContainer widgetId="DCpjFb9Kii1As8Qg" />
    </CustomDashboardContext.Provider>
  );

  const element = screen.getByTestId('pdf-widget-container');
  expect(element).toBeInTheDocument();
});
