/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { logIdMatrixParameter, selectedTagsRawLogs } from 'in-logging/navigation/matrix';
import RawLogs from 'in-logging/analyze/AnalyzeView/components/raw/RawLogs';
import StateManagement from 'in-components/AnalyzeView/StateManagement';
import { rawLogsPath } from 'in-logging/navigation/paths';
import { getTagCatalog } from 'in-logging/api/catalog';
import useUrlState from 'in-hooks/useUrlState';

const urlStateDefinition = {
  bind: [selectedTagsRawLogs]
};

export default function LoggingAnalyzeView() {
  const [{ tags }, onChange] = useUrlState(urlStateDefinition);

  const furtherProps = {
    selectedTags: tags,
    onSelectedTagsChange: _tags => onChange({ tags: _tags })
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
      {opts => <RawLogs {...opts} {...furtherProps} />}
    </StateManagement>
  );
}
