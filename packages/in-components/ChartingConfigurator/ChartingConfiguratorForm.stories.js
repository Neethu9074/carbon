/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import ChartingConfiguratorForm from 'in-components/ChartingConfigurator/ChartingConfiguratorForm';

import locals from './GroupedChartingConfigurator.mless';

const baseArgs = {
  onChange: () => {},
  dataSource: 'logs',
  unifiedMetricsSource: 'LOGS',
  value: {
    metricId: 'logs_distribution',
    aggregationId: 'SUM'
  }
};

const meta = {
  component: ChartingConfiguratorForm
};

export default meta;

export const AllSelections = {
  component: ChartingConfiguratorForm,
  decorators: [
    Story => (
      <div className={locals.wrapper}>
        <Story />
      </div>
    )
  ],
  args: {
    ...baseArgs,
    options: {
      templates: [],
      metrics: [
        {
          metricId: 'logs_distribution',
          label: 'Logs',
          formatter: 'number.compact',
          aggregations: [
            {
              id: 'SUM',
              label: 'sum',
              renderers: [
                {
                  id: 'bar',
                  label: 'Bar'
                },
                {
                  id: 'bar',
                  label: 'bar2'
                }
              ]
            },
            {
              id: 'MEDIAN',
              label: 'xyz',
              renderers: [
                {
                  id: 'bar',
                  label: 'Bar'
                }
              ]
            }
          ]
        },
        {
          metricId: 'logs_distribution',
          label: 'Logs 2',
          formatter: 'number.compact',
          aggregations: [
            {
              id: 'SUM',
              label: 'sum',
              renderers: [
                {
                  id: 'bar',
                  label: 'Bar'
                }
              ]
            },
            {
              id: 'MEDIAN',
              label: 'xyz',
              renderers: [
                {
                  id: 'bar',
                  label: 'Bar'
                }
              ]
            }
          ]
        }
      ]
    }
  }
};

export const RendererSelection = {
  component: ChartingConfiguratorForm,
  decorators: [
    Story => (
      <div className={locals.wrapper}>
        <Story />
      </div>
    )
  ],
  args: {
    ...baseArgs,
    options: {
      templates: [],
      metrics: [
        {
          metricId: 'logs_distribution',
          label: 'Logs',
          formatter: 'number.compact',
          aggregations: [
            {
              id: 'SUM',
              label: 'sum',
              renderers: [
                {
                  id: 'bar',
                  label: 'Bar'
                },
                {
                  id: 'bar',
                  label: 'bar2'
                }
              ]
            },
            {
              id: 'MEDIAN',
              label: 'xyz',
              renderers: [
                {
                  id: 'bar',
                  label: 'Bar'
                }
              ]
            }
          ]
        },
        {
          metricId: 'logs_distribution',
          label: 'Logs 2',
          formatter: 'number.compact',
          aggregations: [
            {
              id: 'SUM',
              label: 'sum',
              renderers: [
                {
                  id: 'bar',
                  label: 'Bar'
                }
              ]
            },
            {
              id: 'MEDIAN',
              label: 'xyz',
              renderers: [
                {
                  id: 'bar',
                  label: 'Bar'
                }
              ]
            }
          ]
        }
      ]
    }
  }
};

export const SingleMetric = {
  component: ChartingConfiguratorForm,
  decorators: [
    Story => (
      <div className={locals.wrapper}>
        <Story />
      </div>
    )
  ],
  args: {
    ...baseArgs,
    options: {
      templates: [],
      metrics: [
        {
          metricId: 'logs_distribution',
          label: 'Logs',
          formatter: 'number.compact',
          aggregations: [
            {
              id: 'SUM',
              label: 'sum',
              renderers: [
                {
                  id: 'bar',
                  label: 'Bar'
                },
                {
                  id: 'bar',
                  label: 'bar2'
                }
              ]
            },
            {
              id: 'MEDIAN',
              label: 'xyz',
              renderers: [
                {
                  id: 'bar',
                  label: 'Bar'
                }
              ]
            }
          ]
        },
        {
          metricId: 'logs_distribution',
          label: 'Logs 2',
          formatter: 'number.compact',
          aggregations: [
            {
              id: 'SUM',
              label: 'sum',
              renderers: [
                {
                  id: 'bar',
                  label: 'Bar'
                }
              ]
            },
            {
              id: 'MEDIAN',
              label: 'xyz',
              renderers: [
                {
                  id: 'bar',
                  label: 'Bar'
                }
              ]
            }
          ]
        }
      ]
    }
  }
};

export const SingleAggregationMetric = {
  component: ChartingConfiguratorForm,
  decorators: [
    Story => (
      <div className={locals.wrapper}>
        <Story />
      </div>
    )
  ],
  args: {
    ...baseArgs,
    options: {
      templates: [],
      metrics: [
        {
          metricId: 'logs_distribution',
          label: 'Logs',
          formatter: 'number.compact',
          aggregations: [
            {
              id: 'SUM',
              label: 'sum',
              renderers: [
                {
                  id: 'bar',
                  label: 'Bar'
                }
              ]
            }
          ]
        }
      ]
    }
  }
};

export const WithTemplates = {
  component: ChartingConfiguratorForm,
  decorators: [
    Story => (
      <div className={locals.wrapper}>
        <Story />
      </div>
    )
  ],
  args: {
    ...baseArgs,
    options: {
      templates: ['template1', 'template2'],
      metrics: [
        {
          metricId: 'logs_distribution',
          label: 'Logs',
          formatter: 'number.compact',
          aggregations: [
            {
              id: 'SUM',
              label: 'sum',
              renderers: [
                {
                  id: 'bar',
                  label: 'Bar'
                },
                {
                  id: 'bar',
                  label: 'bar2'
                }
              ]
            },
            {
              id: 'MEDIAN',
              label: 'xyz',
              renderers: [
                {
                  id: 'bar',
                  label: 'Bar'
                }
              ]
            }
          ]
        },
        {
          metricId: 'logs_distribution',
          label: 'Logs 2',
          formatter: 'number.compact',
          aggregations: [
            {
              id: 'SUM',
              label: 'sum',
              renderers: [
                {
                  id: 'bar',
                  label: 'Bar'
                }
              ]
            },
            {
              id: 'MEDIAN',
              label: 'xyz',
              renderers: [
                {
                  id: 'bar',
                  label: 'Bar'
                }
              ]
            }
          ]
        }
      ]
    }
  }
};
