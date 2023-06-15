/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import PropTypes from 'prop-types';
import React from 'react';

import {
  getEventName,
  getMetricCount,
  getTableData
} from 'in-alerting/smart-alerts/mobileApp/components/customEventsUtil';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { and } from 'in-components/QueryBuilder/ConjunctionSelectorOverlay/supportedSelections';
import CustomEventRow from 'in-alerting/smart-alerts/mobileApp/components/CustomEventRow';
import { joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
import MetricValue from 'in-components/tables/ServerTable/components/MetricValue';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import List from 'in-settings/components/List';
import Label from 'in-components/form/Label';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/mobileApp/components/CustomEventsList.mless';

const columnDefinitions = [
  {
    id: 'name',
    width: '60',
    label: t('in-alerting:smartAlerts.mobileApp.customEvent.customEventNameColumnLabel'),
    getContent: item => {
      return <CustomEventRow item={item} />;
    }
  },
  {
    id: 'occurrencesAgg',
    width: '20',
    label: t('in-alerting:smartAlerts.mobileApp.customEvent.customEventOccurrencesColumnLabel'),
    getValue: item => getMetricCount(item.metrics.occurrencesAgg),
    getContent: item => <MetricValue value={getMetricCount(item.metrics.occurrencesAgg, true)} />
  },
  {
    id: 'usersAgg',
    width: '20',
    label: t('in-alerting:smartAlerts.mobileApp.customEvent.customEventUsersColumnLabel'),
    getValue: item => getMetricCount(item.metrics.usersAgg),
    getContent: item => <MetricValue value={getMetricCount(item.metrics.usersAgg, true)} />
  }
];

export default function CustomEventsList({
  mobileAppId,
  tagFilterExpression,
  timeConfig,
  onCustomEventSelect,
  slideOut
}) {
  const expression = joinExpressions({
    logicalOperator: and,
    expressions: [
      tagFilter('mobileBeacon.mobileApp.id', 'EQUALS', mobileAppId),
      tagFilter('mobileBeacon.type', 'EQUALS', 'custom'),
      tagFilterExpression
    ]
  });

  return (
    <>
      <List
        key={Math.random()}
        getCustomHeader={() => (
          <Label className={locals.customEventListInfo}>
            {t('in-alerting:smartAlerts.mobileApp.customEvent.customEventListInfoLabel')}
          </Label>
        )}
        searchAttributes={[entity => entity.name]}
        searchPlaceholder={t('in-alerting:smartAlerts.mobileApp.customEvent.searchCustomEvents')}
        searchMaxWidth={250}
        getEntityName={config => config.name}
        columnDefinitions={columnDefinitions}
        loadEntities={() =>
          getTableData({
            tagFilterExpression: toBackendQueryModel(expression),
            timeConfig
          })
            .filter(tableData => tableData.data)
            .map(tableData => tableData.data.items)
        }
        pageSize={10}
        noDataMessage={t('in-alerting:smartAlerts.mobileApp.customEvent.noCustomEventsFound')}
        onRowClick={item => {
          onCustomEventSelect(getEventName(item));
          slideOut();
        }}
        isSearchable
      />
    </>
  );
}

CustomEventsList.propTypes = {
  mobileAppId: PropTypes.string.isRequired,
  tagFilterExpression: PropTypes.arrayOf(PropTypes.object).isRequired,
  onCustomEventSelect: PropTypes.func.isRequired,
  slideOut: PropTypes.func.isRequired,
  timeConfig: PropTypes.object.isRequired
};
