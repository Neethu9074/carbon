/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import WidgetEditorDialogPresenter from './WidgetEditorDialogPresenter';
import { getInitialFormState } from './WidgetEditorDialog';
export default {
  component: WidgetEditorDialogPresenter
};

export function PieEdit() {
  const pieForm = getInitialFormState(pieWidget);

  return <WidgetEditorDialogPresenter form={pieForm} />;
}

const pieWidget = {
  id: 'l_QgsvwNoAYvsopI',
  title: '',
  width: 1,
  height: 1,
  x: 0,
  y: 0,
  type: 'pie',
  config: {
    shareMaxAxisDomain: false,
    y1: {
      formatter: 'number.detailed',
      renderer: 'pie',
      metrics: [
        {
          includeSynthetic: false,
          color: '',
          metric: 'calls',
          timeShift: 0,
          tagFilterExpression: {
            logicalOperator: 'AND',
            elements: [],
            type: 'EXPRESSION'
          },
          metricLabel: 'Calls',
          compareToTimeShifted: false,
          aggregation: 'SUM',
          label: '',
          source: 'APPLICATION',
          includeInternal: false
        },
        {
          includeSynthetic: false,
          color: '',
          metric: 'latency',
          timeShift: 0,
          tagFilterExpression: {
            logicalOperator: 'AND',
            elements: [],
            type: 'EXPRESSION'
          },
          metricLabel: 'Latency',
          compareToTimeShifted: false,
          aggregation: 'P25',
          label: '',
          source: 'APPLICATION',
          includeInternal: false
        }
      ]
    },
    y2: {
      formatter: 'number.detailed',
      renderer: 'line',
      metrics: []
    }
  }
};
