/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import { getFiltersCount } from 'in-alerting/smart-alerts/components/limitedFilters';
import { alertConfig } from 'in-alerting/smart-alerts/logs/data/testData.json';
import ScopeColumn from 'in-alerting/smart-alerts/logs/lists/ScopeColumn';
import { t } from 'in-i18n';

describe('ScopeColumn : in-alerting/smart-alerts/logs/lists/ScopeColumn', () => {
  it('should render correctly and display Entity/Metric name', () => {
    render(<ScopeColumn config={alertConfig} />);
    expect(screen.getByText(t('in-alerting:smartAlerts.logs.logCount'))).toBeInTheDocument();
  });

  it('there should be tagfilter tooltip if tagfilter is present in alert config', () => {
    alertConfig.tagFilterExpression = {
      type: 'EXPRESSION',
      logicalOperator: 'AND',
      elements: [
        {
          type: 'TAG_FILTER',
          name: 'log.exception.stackTrace',
          stringValue: '123',
          numberValue: null,
          booleanValue: null,
          key: null,
          value: '123',
          operator: 'EQUALS',
          entity: 'NOT_APPLICABLE'
        },
        {
          type: 'TAG_FILTER',
          name: 'log.message',
          stringValue: 'some',
          numberValue: null,
          booleanValue: null,
          key: null,
          value: 'some',
          operator: 'EQUALS',
          entity: 'NOT_APPLICABLE'
        },
        {
          type: 'TAG_FILTER',
          name: 'log.exception.type',
          stringValue: 'asd',
          numberValue: null,
          booleanValue: null,
          key: null,
          value: 'asd',
          operator: 'EQUALS',
          entity: 'NOT_APPLICABLE'
        },
        {
          type: 'TAG_FILTER',
          name: 'log.custom',
          stringValue: 'qwe=12',
          numberValue: null,
          booleanValue: null,
          key: 'qwe',
          value: '12',
          operator: 'EQUALS',
          entity: 'NOT_APPLICABLE'
        }
      ]
    };
    render(<ScopeColumn config={alertConfig} />);
    const tagFilterFormModel = fromBackendModel(alertConfig.tagFilterExpression);
    const otherTagFiltersCount = tagFilterFormModel.length;
    const filterCount = getFiltersCount(tagFilterFormModel);
    if (otherTagFiltersCount > 0) {
      expect(
        screen.getByText(
          t('in-alerting:smartAlerts.logs.list.filter', {
            count: filterCount
          })
        )
      ).toBeInTheDocument();
    }
  });
});
