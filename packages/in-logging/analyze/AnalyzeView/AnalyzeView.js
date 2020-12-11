import React from 'react';

import GroupedLogs from 'in-logging/analyze/AnalyzeView/components/GroupedLogs';
import StateManagement from 'in-new-components/AnalyzeView/StateManagement';
import { logIdMatrixParameter } from 'in-logging/navigation/matrix';
import Logs from 'in-logging/analyze/AnalyzeView/components/Logs';
import { selectedTags } from 'in-logging/navigation/matrix';
import { logsPath } from 'in-logging/navigation/paths';
import { getTagCatalog } from 'in-logging/api/catalog';
import useUrlState from 'in-hooks/useUrlState';

const urlStateDefinition = {
  bind: [selectedTags]
};

export default function LoggingAnalyzeView() {
  const [{ tags: selectedTags }, onChange] = useUrlState(urlStateDefinition);

  const furtherProps = {
    selectedTags,
    onSelectedTagsChange: tags => onChange({ tags })
  };

  return (
    <StateManagement
      path={logsPath}
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
      {opts => (opts.isGrouped ? <GroupedLogs {...opts} {...furtherProps} /> : <Logs {...opts} {...furtherProps} />)}
    </StateManagement>
  );
}
