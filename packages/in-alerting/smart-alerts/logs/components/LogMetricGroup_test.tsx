/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { mount, shallow } from 'enzyme';
import React from 'react';

import { EXPRESSION } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import LogMetricGroup from 'in-alerting/smart-alerts/logs/components/LogMetricGroup';
import { NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import data from 'in-alerting/smart-alerts/logs/data/alertConfigData.json';
import { TagFilterExpressionElementUnion } from 'in-types';

const props = {
  backendQueryModel: { type: EXPRESSION, logicalOperator: 'AND', elements: [] } as TagFilterExpressionElementUnion,
  tagCatalog: data.tagCatalog,
  groupBy: [
    {
      groupbyTag: 'log.streamName',
      groupbyTagEntity: NOT_APPLICABLE,
      groupbyTagSecondLevelKey: undefined
    }
  ],
  timeConfig: { autoRefresh: false, windowSize: 86400000, to: 1710253571003, focusedMoment: 1710253571003 }
};
describe('in-alerting/smart-alerts/logs/components/LogMetricGroup', () => {
  test('renders correctly with default props', () => {
    const result = mount(<LogMetricGroup {...props} />);
    expect(result).toMatchInlineSnapshot(`ReactWrapper {}`);
  });

  test('renders correctly with search by ', () => {
    const wrapper = shallow(<LogMetricGroup {...props} />);
    // Check if actions exists and are triggered
    const setBackendQueryModel = wrapper.find('LogMetricGroupTableList').prop('setBackendQueryModel');
    //@ts-expect-error this has error unknown type as this function is passed as prop to compoenent
    setBackendQueryModel('test');
  });
});
