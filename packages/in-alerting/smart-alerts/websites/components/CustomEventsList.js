/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import PropTypes from 'prop-types';
import React from 'react';

import getWebsitePaginatedBeaconGroups from 'in-websites/subscriptions/getWebsitePaginatedBeaconGroups';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { and } from 'in-components/QueryBuilder/ConjunctionSelectorOverlay/supportedSelections';
import { joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import List from 'in-settings/components/List';
import Label from 'in-components/form/Label';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/websites/components/CustomEventsList.mless';

const columnDefinitions = [
  {
    id: 'name',
    label: t('in-alerting:smartAlerts.websites.customEvent.customEventNameColumnLabel'),
    getContent: item => CustomEventRow(item)
  }
];

export default function CustomEventsList({
  websiteId,
  tagFilterExpression,
  timeConfig,
  onCustomEventSelect,
  slideOut
}) {
  const expression = joinExpressions({
    logicalOperator: and,
    expressions: [
      tagFilter('beacon.website.id', 'EQUALS', websiteId),
      tagFilter('beacon.type', 'EQUALS', 'custom'),
      tagFilterExpression
    ]
  });

  return (
    <>
      <List
        key={Math.random()}
        getCustomHeader={() => (
          <Label className={locals.customEventListInfo}>
            {t('in-alerting:smartAlerts.websites.customEvent.customEventListInfoLabel')}
          </Label>
        )}
        searchAttributes={[entity => entity.name]}
        searchPlaceholder={t('in-alerting:smartAlerts.websites.customEvent.searchCustomEvents')}
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
        noDataMessage={t('in-alerting:smartAlerts.websites.customEvent.noCustomEventsFound')}
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
  websiteId: PropTypes.string.isRequired,
  tagFilterExpression: PropTypes.arrayOf(PropTypes.object).isRequired,
  onCustomEventSelect: PropTypes.func.isRequired,
  slideOut: PropTypes.func.isRequired,
  timeConfig: PropTypes.object.isRequired
};

function getTableData({ timeConfig, tagFilterExpression }) {
  return getWebsitePaginatedBeaconGroups({
    tagFilterExpression,
    timeConfig,
    pagination: {
      page: 1,
      pageSize: 200
    },
    order: {
      by: 'occurrencesAgg',
      direction: 'DESC',
      collation: 'en-US'
    },
    group: {
      groupbyTag: 'beacon.customEvent.name'
    },
    metrics: {
      occurrencesAgg: {
        metric: 'beaconCount',
        aggregation: 'SUM'
      },
      usersAgg: {
        metric: 'uniqueUsersOrSessions',
        aggregation: 'DISTINCT_COUNT'
      }
    }
  });
}

function getEventName(item) {
  let label = item.name;
  // We do the below parsing as the back-end is sending name property as json wrapped in string.
  // Ref Code https://github.ibm.com/instana/backend/blob/cd654045c239c68baacc5bd424c3ec81975ac102/appdata-reader/src/main/java/com/instana/application/datareader/command/website/GetWebsiteBeaconGroupsCommandHandler.java#L417-L417
  try {
    label = String(JSON.parse(label));
  } catch (e) {
    // ignore
  }
  return label;
}

function CustomEventRow(item) {
  let label = getEventName(item);

  return (
    <Tooltip content={label} align="topLeft" delay={500}>
      <div className={locals.row}>{label}</div>
    </Tooltip>
  );
}
