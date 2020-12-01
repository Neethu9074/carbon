import React from 'react';

import StateManagement from 'in-new-components/AnalyzeView/StateManagement';
import LogDetail from 'in-logging/analyze/AnalyzeView/LogDetail/LogDetail';
import GroupedLogs from 'in-logging/analyze/AnalyzeView/GroupedLogs';
import { logIdMatrixParameter } from 'in-logging/navigation/matrix';
import { analyzePath } from 'in-logging/navigation/paths';
import { getTagCatalog } from 'in-logging/api/catalog';
import Logs from 'in-logging/analyze/AnalyzeView/Logs';

export default function LoggingAnalyzeView() {
  return (
    <StateManagement
      path={analyzePath}
      defaultDataSource="logs"
      dataSourceParameter={logIdMatrixParameter}
      getTagCatalog={getTagCatalog}
      groupedView={{
        defaultOrderBy: 'count',
        defaultOrderDirection: 'DESC'
      }}
      ungroupedView={{
        defaultOrderBy: 'timestamp',
        defaultOrderDirection: 'DESC'
      }}
    >
      {opts => {
        const { detailId, isGrouped } = opts;
        if (detailId) {
          return <LogDetail {...opts} />;
        } else if (isGrouped) {
          return <GroupedLogs {...opts} />;
        } else {
          return <Logs {...opts} />;
        }
      }}
    </StateManagement>
  );
}
