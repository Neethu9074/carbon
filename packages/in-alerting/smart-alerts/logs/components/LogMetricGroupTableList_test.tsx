/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { mount } from 'enzyme';
import React from 'react';

import { ResultPrecision } from '@instana/types';

import LogMetricGroupTableList from 'in-alerting/smart-alerts/logs/components/LogMetricGroupTableList';
import { NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import data from 'in-alerting/smart-alerts/logs/data/alertConfigData.json';

const props = {
  setBackendQueryModel: jest.fn(),
  canLoadMore: false,
  tagCatalog: data.tagCatalog,
  loadMore: jest.fn(),
  fixedLayout: true,
  retrievalSize: 5,
  totalHits: 2,
  groupBy: [
    {
      groupbyTag: 'log.streamName',
      groupbyTagEntity: NOT_APPLICABLE,
      groupbyTagSecondLevelKey: undefined
    }
  ],
  errors: [],
  progress: {
    loading: false,
    note: undefined,
    percentage: 0
  },
  resultPrecisionDetails: { resultPrecision: 'PRECISION_UNKNOWN' as ResultPrecision },
  awaitingData: false,
  items: [],
  reloadCount: 0
};

describe('in-alerting/smart-alerts/logs/components/LogMetricGroupTableList', () => {
  test('renders correctly with default props with empty data', () => {
    const result = mount(<LogMetricGroupTableList {...props} />);
    expect(result).toMatchInlineSnapshot(`ReactWrapper {}`);
  });

  test('renders correctly with default props with data', () => {
    const newProps = {
      ...props,

      items: [
        {
          label: 'org.camunda.bpm.engine.ProcessEngineException',
          numberOfLogs: 29,
          percentage: 0.6590909090909091,
          cursor: {
            '@class': '.IngestionOffsetCursor',
            ingestionTime: 1710248081000,
            offset: 1
          }
        }
      ]
    };
    const result = mount(<LogMetricGroupTableList {...newProps} />);
    expect(result).toMatchInlineSnapshot(`ReactWrapper {}`);
  });
});
