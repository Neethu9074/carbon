/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import StateManagement from 'in-new-components/AnalyzeView/StateManagement';
import RawLogs from 'in-logging/analyze/AnalyzeView/components/raw/RawLogs';
import { logIdMatrixParameter } from 'in-logging/navigation/matrix';
import { selectedTagsRawLogs } from 'in-logging/navigation/matrix';
import { rawLogsPath } from 'in-logging/navigation/paths';
import { getTagCatalog } from 'in-logging/api/catalog';
import useUrlState from 'in-hooks/useUrlState';

const urlStateDefinition = {
  bind: [selectedTagsRawLogs]
};

export default function LoggingAnalyzeView() {
  const [{ tags: selectedTags }, onChange] = useUrlState(urlStateDefinition);

  const furtherProps = {
    selectedTags,
    onSelectedTagsChange: tags => onChange({ tags })
  };

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
            defaultOrderDirection: 'DESC'
          },
          ungroupedView: {
            defaultOrderBy: 'timestamp',
            defaultOrderDirection: 'ASC'
          }
        }
      }}
    >
      {opts => <RawLogs {...opts} {...furtherProps} />}
    </StateManagement>
  );
}
