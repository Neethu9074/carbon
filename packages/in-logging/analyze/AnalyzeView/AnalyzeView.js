/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import GroupedLogs from 'in-logging/analyze/AnalyzeView/components/GroupedLogs';
import StateManagement from 'in-new-components/AnalyzeView/StateManagement';
import { logIdMatrixParameter } from 'in-logging/navigation/matrix';
import Logs from 'in-logging/analyze/AnalyzeView/components/Logs';
import { selectedTags } from 'in-logging/navigation/matrix';
import { getTagCatalog } from 'in-logging/api/catalog';
import { logsPath } from 'in-logging/navigation/paths';
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
      dataSourceConfigurations={{
        logs: {
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
          defaultSelectableFields: []
        }
      }}
    >
      {opts => (opts.isGrouped ? <GroupedLogs {...opts} {...furtherProps} /> : <Logs {...opts} {...furtherProps} />)}
    </StateManagement>
  );
}
