/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import StateManagement, { StateManagementChildProps } from 'in-components/AnalyzeView/StateManagement';
import QueryBuilderWorkspace from 'in-logging/analyze/AnalyzeView/components/QueryBuilderWorkspace';
import { dataSourceConfigurations } from 'in-logging/analyze/AnalyzeView/utils/constants';
import { ConsoleViewContent } from 'in-logging/analyze/ConsoleView/ConsoleViewContent';
import { logIdMatrixParameter } from 'in-logging/navigation/matrix';
import { getMetricTemplates } from 'in-logging/api/metricTemplates';
import { logsPath } from 'in-logging/navigation/paths';
import { getTagCatalog } from 'in-logging/api/catalog';

export default function ConsoleView() {
  return (
    <StateManagement
      path={logsPath}
      defaultDataSource="logs"
      dataSourceParameter={logIdMatrixParameter}
      getTagCatalog={getTagCatalog}
      getMetricTemplates={getMetricTemplates}
      dataSourceConfigurations={dataSourceConfigurations}>
      {(opts: StateManagementChildProps) => {
        return (
          <QueryBuilderWorkspace {...opts} showGroupingConfiguration={false} showTimeSelection={false}>
            <ConsoleViewContent filters={opts.backendQueryModel} />
          </QueryBuilderWorkspace>
        );
      }}
    </StateManagement>
  );
}
