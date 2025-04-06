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
  hideRenderer: true,
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

export const Default = {
  component: ChartingConfiguratorForm,
  decorators: [
    Story => (
      <div style={{ width: '100%' }}>
        <div className={locals.wrapper}>
          <Story />
        </div>
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
          label: 'Logs and counts',
          formatter: 'number.compact',
          aggregations: [
            {
              id: 'SUM',
              label: 'sum',
              renderers: [{ id: 'template1', label: 'renderer' }]
            },
            {
              id: 'MEDIAN',
              label: 'median'
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
    hideRenderer: false,
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
                  id: 'pie',
                  label: 'Pie'
                }
              ]
            },
            {
              id: 'MEDIAN',
              label: 'median',
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
              label: 'median',
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

export const CustomMetric = {
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
          customMetric: true,
          secondLevelMetricId: 'custom metric',
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
              renderers: []
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
              label: 'median',
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
              label: 'median',
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
