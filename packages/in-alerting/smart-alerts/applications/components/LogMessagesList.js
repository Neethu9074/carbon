/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import React from 'react';

import { combineLatest, just } from '@instana/observables';
import { Pill } from '@instana/components';

import { createApplicationIdTagFilter } from 'in-alerting/smart-alerts/applications/scopeConfig/ServicesAndEndpointsListPresenter/tagFilterCreators';
import { and, or } from 'in-components/QueryBuilder/ConjunctionSelectorOverlay/supportedSelections';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import getCallGroups from 'in-applications/subscriptions/getCallGroups';
import { propTypeTimeConfig } from 'in-stores/time/config';
import List from 'in-settings/components/List';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/applications/components/LogMessagesList.mless';

const columnDefinitions = [
  {
    id: 'level',
    label: t('in-alerting:smartAlerts.applications.logMessages.levelColumn'),
    width: 10,
    getContent(item) {
      return <Pill type="gray">{item.level}</Pill>;
    }
  },
  {
    id: 'message',
    label: t('in-alerting:smartAlerts.applications.logMessages.messageColumn'),
    getContent: item => LogRow(item),
    noWrap: true,
    ellipsis: '50vw'
  }
];

export default function LogMessagesList({
  applications,
  tagFilterExpression,
  applicationBoundaryScope,
  includeInternal = false,
  includeSynthetic = false,
  timeConfig,
  onLogMessageSelect,
  slideOut,
  pageSize = 10,
  logsTearsheetColumns = [],
  header = null,
  currentPage = 1,
  setCurrentPage,
  tearSheetView
}) {
  return (
    <List
      key={Math.random()} // It's save to trigger a reload this way because results are memoized in the backend.
      getHeader={() => header}
      searchAttributes={[entity => entity.message]}
      getEntityName={config => config.message}
      columnDefinitions={
        logsTearsheetColumns?.length > 0
          ? getColumnDefinition(logsTearsheetColumns, columnDefinitions[1])
          : columnDefinitions
      }
      loadEntities={() =>
        !tearSheetView
          ? isEmpty(applications)
            ? just([]) // Show on–no–data message
            : getTableData({
                applicationIds: Object.keys(applications),
                applicationBoundaryScope,
                includeInternal,
                includeSynthetic,
                tagFilterExpression,
                timeConfig
              })
          : getTableData({
              applicationIds: !isEmpty(applications) ? Object.keys(applications) : undefined,
              applicationBoundaryScope,
              includeInternal,
              includeSynthetic,
              tagFilterExpression,
              timeConfig
            })
      }
      pageSize={pageSize ?? 10}
      noDataMessage={t('in-alerting:smartAlerts.applications.logMessages.noDataMessage')}
      onRowClick={log => {
        onLogMessageSelect(log.message, log.level);
        slideOut();
      }}
      isSearchable
      initialPageNumber={currentPage}
      onPageChange={page => setCurrentPage(page)}
    />
  );
}

LogMessagesList.propTypes = {
  applications: PropTypes.object.isRequired,
  tagFilterExpression: PropTypes.array,
  applicationBoundaryScope: PropTypes.string.isRequired,
  includeInternal: PropTypes.bool,
  includeSynthetic: PropTypes.bool,
  onLogMessageSelect: PropTypes.func.isRequired,
  slideOut: PropTypes.func.isRequired,
  timeConfig: propTypeTimeConfig.isRequired,
  pageSize: PropTypes.number,
  logsTearsheetColumns: PropTypes.array,
  header: PropTypes.element,
  currentPage: PropTypes.number,
  setCurrentPage: PropTypes.func,
  tearSheetView: PropTypes.bool
};

function getTableData(kvArgs) {
  const warnMessages = getLogMessages({
    logLevel: 'WARN',
    ...kvArgs
  });

  const errorMessages = getLogMessages({
    logLevel: 'ERROR',
    ...kvArgs
  });

  return (
    // Individually filter out loading states here,
    // because List determines its loading state by the absence of an observable emission and combineLatest will always emit
    // if any of the combined observables emits, at which point its impossible to distinguish a loading state from an empty result
    combineLatest([
      warnMessages.filter(({ progress }) => !progress.loading),
      errorMessages.filter(({ progress }) => !progress.loading)
    ])
      .map(result => result.flatMap(r => r.data?.items).filter(Boolean))
      // sort messages by amount of calls, this is done client side because the order is lost when combining the observables
      .map(r => r.sort((l, r) => r.metrics['calls_SUM'][0][1] - l.metrics['calls_SUM'][0][1]))
  );
}

function getLogMessages({
  applicationIds,
  tagFilterExpression,
  applicationBoundaryScope,
  includeInternal,
  includeSynthetic,
  timeConfig,
  logLevel
}) {
  return getCallGroups({
    tagFilterExpression: buildTagFilterExpression({
      applicationIds,
      logLevel,
      tagFilterExpression,
      applicationBoundaryScope
    }),
    group: {
      groupbyTag: 'log.message'
    },
    order: {
      by: 'calls_SUM',
      direction: 'DESC'
    },
    pagination: {
      page: 1,
      retrievalSize: 200
    },
    filter: {
      timeConfig
    },
    metrics: {
      calls_SUM: { metric: 'calls', aggregation: 'SUM' }
    },
    includeSynthetic,
    includeInternal
  }).map(result => {
    if (result?.data?.items?.length) {
      return {
        ...result,
        data: {
          ...result.data,
          // Inject log level into results and restructure items to look more like the response of GetLogMessages
          items: result.data.items.map(({ name, ...rest }) => ({ ...rest, message: name, level: logLevel }))
        }
      };
    }
    return result;
  });
}

function buildTagFilterExpression({ applicationIds, logLevel, tagFilterExpression, applicationBoundaryScope }) {
  return toBackendQueryModel(
    joinExpressions({
      logicalOperator: and,
      expressions: [
        joinExpressions({
          logicalOperator: or,
          expressions: applicationIds
            ? applicationIds.map(id => createApplicationIdTagFilter(id, applicationBoundaryScope))
            : undefined
        }),
        tagFilter('log.level', 'EQUALS', logLevel),
        tagFilterExpression
      ]
    })
  );
}

function LogRow(item) {
  return (
    <Tooltip content={item.message} delay={500} align="auto" forceTheme>
      <div className={locals.row}>{item.message}</div>
    </Tooltip>
  );
}

function getColumnDefinition(logsTearsheetColumns, columnDefinitions) {
  return [...logsTearsheetColumns, columnDefinitions];
}
