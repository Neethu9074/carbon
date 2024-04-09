/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React, { useState } from 'react';
import { xor } from 'lodash';

import { create, just } from '@instana/observables';

import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import AnalyzeLogsButton from 'in-kubernetes/Dashboards/commonComponents/AnalyzeLogsButton';
import { NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import LogsChart from 'in-kubernetes/Dashboards/commonComponents/LogsChart';
import { getValueMatchTagFilter, LOG_LEVEL } from 'in-logging/queryBuilder';
import { NOT_EQUAL } from 'in-components/QueryBuilder/tagFilter/operators';
import { useGenerateLinkToLogs } from 'in-logging/navigation/paths';
import { loggingEnabled } from 'in-services/featureFlags';
import RestrictedAccessMessage from 'in-components/rbac';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

export const andOperator = { type: 'CONJUNCTION', logicalOperator: 'AND' };
export const andQuery = (...inputs) => {
  const query = [];
  for (let i = 0; i < inputs.length; i++) {
    let input = inputs[i];
    query.push(input);
    if (i < inputs.length - 1) {
      query.push(andOperator);
    }
  }
  return query;
};
export const tagEquals = (tag, value) => ({
  entity: NOT_APPLICABLE,
  type: 'TAG_FILTER',
  operator: 'EQUALS',
  name: tag,
  value
});

export function LogsChartInteractionWrapper({ tagFilterExpression, timeConfig }) {
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [isHovered$] = useState(create().emit(false));
  const generateLinkToLogs = useGenerateLinkToLogs();
  if (!loggingEnabled) {
    return <></>;
  }

  if (!role.canViewLogs) {
    return (
      <DashboardSection title={t('in-forge:plugins.docker.dashboard.logs')}>
        <RestrictedAccessMessage permission={t('in-stores:permissionCanViewLogsLabel')} />
      </DashboardSection>
    );
  }

  const groupFilters = filteredGroups.map(group =>
    getValueMatchTagFilter({ name: LOG_LEVEL, value: group, operator: NOT_EQUAL })
  );
  const UALinkTagFilters = andQuery(...groupFilters, ...tagFilterExpression);
  const additionalContextMenuButtons = [
    {
      name: 'analyze',
      icon: 'lib_analyze',
      label: t('in-forge:plugins.docker.dashboard.seeLogsInAnalyze'),
      getHref$: highlightedTime => {
        return just(
          generateLinkToLogs({
            tagFilterExpression: UALinkTagFilters,
            timeConfig: {
              focusedMoment: highlightedTime.focusedMoment,
              to: highlightedTime.to,
              windowSize: highlightedTime.windowSize,
              autoRefresh: false
            }
          })
        );
      }
    }
  ];

  const logsButton = (
    <AnalyzeLogsButton tagFilterExpression={UALinkTagFilters} timeConfig={timeConfig} isHovered$={isHovered$} />
  );
  return (
    <div onMouseEnter={() => isHovered$.emit(true)} onMouseLeave={() => isHovered$.emit(false)}>
      <DashboardSection title={'Logs'} button={logsButton}>
        <LogsChart
          tagFilterExpression={toBackendQueryModel(tagFilterExpression)}
          additionalContextMenuButtons={additionalContextMenuButtons}
          onLegendItemToggle={(chartConfig, label) => {
            setFilteredGroups(prevState => xor([label.trim().toUpperCase()], prevState));
          }}
        />
      </DashboardSection>
    </div>
  );
}
