/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

//@ts-expect-error needs TS migration
import QueryBuilderWorkspace from 'in-logging/analyze/AnalyzeView/components/QueryBuilderWorkspace';
//@ts-expect-error needs TS migration
import GroupedLogs from 'in-logging/analyze/AnalyzeView/components/GroupedLogs';
import getFacetedSearchSuggestions from 'in-logging/analyze/AnalyzeView/utils/getFacetedSearchSuggestions';
import StateManagement, { StateManagementChildProps } from 'in-components/AnalyzeView/StateManagement';
import { dataSourceConfigurations } from 'in-logging/analyze/AnalyzeView/utils/constants';
import RestrictedAccessMessage from 'in-components/rbac/RestrictedAccessMessage';
import useTimeSpentInsideComponent from 'in-hooks/useTimeSpentInsideComponent';
import { Logs } from 'in-logging/analyze/AnalyzeView/components/Logs';
import { logIdMatrixParameter } from 'in-logging/navigation/matrix';
import { getMetricTemplates } from 'in-logging/api/metricTemplates';
import { timeSpent } from 'in-logging/analyze/AnalyzeView/tracker';
import { getLabel } from 'in-logging/analyze/AnalyzeView/utils';
import { getTagCatalog } from 'in-logging/api/catalog';
import { logsPath } from 'in-logging/navigation/paths';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

export default function LoggingAnalyzeView() {
  useTimeSpentInsideComponent(millisSpentOnAnalyzeView => timeSpent({ millisSpentOnAnalyzeView }));

  return (
    <StateManagement
      path={logsPath}
      defaultDataSource="logs"
      dataSourceParameter={logIdMatrixParameter}
      getTagCatalog={getTagCatalog}
      getMetricTemplates={getMetricTemplates}
      dataSourceConfigurations={dataSourceConfigurations}
    >
      {(opts: StateManagementChildProps) =>
        !role!.canViewLogs ? (
          <QueryBuilderWorkspace {...opts}>
            <RestrictedAccessMessage permission={t('in-stores:permissionCanViewLogsLabel')} />
          </QueryBuilderWorkspace>
        ) : opts.isGrouped ? (
          <GroupedLogs {...opts} getFacetedSearchSuggestions={getFacetedSearchSuggestions} getLabel={getLabel} />
        ) : (
          <Logs {...opts} getFacetedSearchSuggestions={getFacetedSearchSuggestions} />
        )
      }
    </StateManagement>
  );
}
