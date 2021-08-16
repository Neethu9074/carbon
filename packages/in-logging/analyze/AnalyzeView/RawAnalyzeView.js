/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import RawLogs from 'in-logging/analyze/AnalyzeView/components/raw/RawLogs';
import StateManagement from 'in-components/AnalyzeView/StateManagement';
import { logIdMatrixParameter } from 'in-logging/navigation/matrix';
import { rawLogsPath } from 'in-logging/navigation/paths';
import { getTagCatalog } from 'in-logging/api/catalog';

export default function LoggingAnalyzeView() {
  return (
    <StateManagement
      path={rawLogsPath}
      defaultDataSource="rawlogs"
      dataSourceParameter={logIdMatrixParameter}
      getTagCatalog={getTagCatalog}
      dataSourceConfigurations={{
        rawlogs: {
          groupedView: {
            defaultOrderBy: 'count',
            defaultOrderDirection: 'DESC',
            customFieldRenderingInstructions: {}
          },
          ungroupedView: {
            defaultOrderBy: 'timestamp',
            defaultOrderDirection: 'DESC',
            customFieldRenderingInstructions: {}
          },
          facetedSearchItems: [],
          defaultSelectableFields: []
        }
      }}
    >
      {opts => <RawLogs {...opts} />}
    </StateManagement>
  );
}
