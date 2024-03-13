/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { shallow } from 'enzyme';
import React from 'react';

import { Group, TagFilterExpressionElementUnion, TimeConfig } from '@instana/types';

import { chartTimeConfig } from 'in-alerting/smart-alerts/logs/components/LogChartUtils';
import LogMetricGroup from 'in-alerting/smart-alerts/logs/components/LogMetricGroup';
import { NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';

describe('in-alerting/smart-alerts/logs/components/LogMetricGroup', () => {
  it('should render a list of log metric groups', () => {
    const backendQueryModel = {
      type: 'EXPRESSION',
      logicalOperator: 'AND',
      elements: []
    } as TagFilterExpressionElementUnion;
    const timeConfig = chartTimeConfig as TimeConfig;
    const groupBy = [
      {
        groupbyTag: 'log.streamName',
        groupbyTagEntity: NOT_APPLICABLE,
        groupbyTagSecondLevelKey: null
      }
    ];
    const result = shallow(
      <LogMetricGroup
        backendQueryModel={backendQueryModel}
        timeConfig={timeConfig}
        groupBy={groupBy as unknown as Group[]}
      />
    );
    expect(result).toMatchInlineSnapshot(`ShallowWrapper {}`);
  });
});
