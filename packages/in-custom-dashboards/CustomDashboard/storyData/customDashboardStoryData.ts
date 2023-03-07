/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

export const pieWidget = {
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
export const timeSeriesWidget6Dataset2Axis = {
  id: '9qor4So0EJSl8909',
  width: 1,
  height: 1,
  x: 0,
  y: 0,
  title: 'TwoAxis6Set',
  type: 'chart',
  config: {
    type: 'TIME_SERIES',
    y1: {
      formatter: 'number.detailed',
      renderer: 'line',
      metrics: [
        {
          source: 'APPLICATION',
          metric: 'calls',
          aggregation: 'SUM',
          timeShift: 0,
          compareToTimeShifted: false,
          label: 'Calls_Sum',
          metricLabel: 'Calls',
          color: '',
          tagFilterExpression: {
            logicalOperator: 'AND',
            elements: [],
            type: 'EXPRESSION'
          },
          includeInternal: false,
          includeSynthetic: false
        },
        {
          source: 'APPLICATION',
          metric: 'latency',
          aggregation: 'MEAN',
          timeShift: 0,
          compareToTimeShifted: false,
          label: 'MeanyLatency',
          metricLabel: 'Latency',
          color: '',
          tagFilterExpression: {
            logicalOperator: 'AND',
            elements: [],
            type: 'EXPRESSION'
          },
          includeInternal: false,
          includeSynthetic: false
        },
        {
          source: 'APPLICATION',
          metric: 'latency',
          aggregation: 'MIN',
          timeShift: 0,
          compareToTimeShifted: false,
          label: 'LatencyMin',
          metricLabel: 'Latency',
          color: '',
          tagFilterExpression: {
            logicalOperator: 'AND',
            elements: [],
            type: 'EXPRESSION'
          },
          includeInternal: false,
          includeSynthetic: false
        }
      ]
    },
    y2: {
      formatter: 'latency.detailed',
      renderer: 'line',
      metrics: [
        {
          source: 'APPLICATION',
          metric: 'latency',
          aggregation: 'MAX',
          timeShift: 0,
          compareToTimeShifted: false,
          label: 'MaxLatency',
          metricLabel: 'Latency',
          color: '',
          tagFilterExpression: {
            logicalOperator: 'AND',
            elements: [],
            type: 'EXPRESSION'
          },
          includeInternal: false,
          includeSynthetic: false
        },
        {
          source: 'APPLICATION',
          metric: 'calls',
          aggregation: 'PER_SECOND',
          timeShift: 0,
          compareToTimeShifted: false,
          label: 'CallsPerSecond',
          metricLabel: 'Calls',
          color: '',
          tagFilterExpression: {
            logicalOperator: 'AND',
            elements: [],
            type: 'EXPRESSION'
          },
          includeInternal: false,
          includeSynthetic: false
        },
        {
          source: 'APPLICATION',
          metric: 'latency',
          aggregation: 'SUM',
          timeShift: 0,
          compareToTimeShifted: false,
          label: 'SumLatency',
          metricLabel: 'Latency',
          color: '',
          tagFilterExpression: {
            logicalOperator: 'AND',
            elements: [],
            type: 'EXPRESSION'
          },
          includeInternal: false,
          includeSynthetic: false
        }
      ]
    },
    shareMaxAxisDomain: false
  }
};
export const timeSeriesWidget6Dataset2AxisLastOnRight = {
  id: '9qor4So0EJSl8909',
  width: 1,
  height: 1,
  x: 0,
  y: 0,
  title: 'TwoAxis6Set',
  type: 'chart',
  config: {
    type: 'TIME_SERIES',
    y1: {
      formatter: 'number.detailed',
      renderer: 'line',
      metrics: [
        {
          source: 'APPLICATION',
          metric: 'calls',
          aggregation: 'SUM',
          timeShift: 0,
          compareToTimeShifted: false,
          label: 'Calls_Sum',
          metricLabel: 'Calls',
          color: '',
          tagFilterExpression: {
            logicalOperator: 'AND',
            elements: [],
            type: 'EXPRESSION'
          },
          includeInternal: false,
          includeSynthetic: false
        },
        {
          source: 'APPLICATION',
          metric: 'latency',
          aggregation: 'MEAN',
          timeShift: 0,
          compareToTimeShifted: false,
          label: 'MeanyLatency',
          metricLabel: 'Latency',
          color: '',
          tagFilterExpression: {
            logicalOperator: 'AND',
            elements: [],
            type: 'EXPRESSION'
          },
          includeInternal: false,
          includeSynthetic: false
        },
        {
          source: 'APPLICATION',
          metric: 'latency',
          aggregation: 'MAX',
          timeShift: 0,
          compareToTimeShifted: false,
          label: 'MaxLatency',
          metricLabel: 'Latency',
          color: '',
          tagFilterExpression: {
            logicalOperator: 'AND',
            elements: [],
            type: 'EXPRESSION'
          },
          includeInternal: false,
          includeSynthetic: false
        },
        {
          source: 'APPLICATION',
          metric: 'calls',
          aggregation: 'PER_SECOND',
          timeShift: 0,
          compareToTimeShifted: false,
          label: 'CallsPerSecond',
          metricLabel: 'Calls',
          color: '',
          tagFilterExpression: {
            logicalOperator: 'AND',
            elements: [],
            type: 'EXPRESSION'
          },
          includeInternal: false,
          includeSynthetic: false
        },
        {
          source: 'APPLICATION',
          metric: 'latency',
          aggregation: 'MIN',
          timeShift: 0,
          compareToTimeShifted: false,
          label: 'LatencyMin',
          metricLabel: 'Latency',
          color: '',
          tagFilterExpression: {
            logicalOperator: 'AND',
            elements: [],
            type: 'EXPRESSION'
          },
          includeInternal: false,
          includeSynthetic: false
        }
      ]
    },
    y2: {
      formatter: 'latency.detailed',
      renderer: 'line',
      metrics: [
        {
          source: 'APPLICATION',
          metric: 'latency',
          aggregation: 'SUM',
          timeShift: 0,
          compareToTimeShifted: false,
          label: 'SumLatency',
          metricLabel: 'Latency',
          color: '',
          tagFilterExpression: {
            logicalOperator: 'AND',
            elements: [],
            type: 'EXPRESSION'
          },
          includeInternal: false,
          includeSynthetic: false
        }
      ]
    },
    shareMaxAxisDomain: false
  }
};
export const timeSeriesWidget2Axis1Datasett = {
  id: '9qor4So0EJSl8909',
  width: 1,
  height: 1,
  x: 0,
  y: 0,
  title: 'TwoAxis6Set',
  type: 'chart',
  config: {
    type: 'TIME_SERIES',
    y1: {
      formatter: 'number.detailed',
      renderer: 'line',
      metrics: []
    },
    y2: {
      formatter: 'latency.detailed',
      renderer: 'line',
      metrics: [
        {
          source: 'APPLICATION',
          metric: 'latency',
          aggregation: 'SUM',
          timeShift: 0,
          compareToTimeShifted: false,
          label: 'SumLatency',
          metricLabel: 'Latency',
          color: '',
          tagFilterExpression: {
            logicalOperator: 'AND',
            elements: [],
            type: 'EXPRESSION'
          },
          includeInternal: false,
          includeSynthetic: false
        }
      ]
    },
    shareMaxAxisDomain: false
  }
};
