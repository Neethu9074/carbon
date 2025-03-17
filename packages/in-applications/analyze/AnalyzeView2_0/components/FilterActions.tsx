/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Group, TagFilterExpressionElementUnion, DataSource } from '@instana/types';
import { CarbonStack as Stack } from '@instana/components';

import { SaveFilterPopover } from 'in-applications/analyze/components/SaveFilters/SaveFilterPopover';
import { SavedFilters } from 'in-applications/analyze/components/SaveFilters/SavedFilters';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';

interface Props {
  dataSource: DataSource;
  group: Group;
  formModel: FormModelElement[];
  backendQueryModel: TagFilterExpressionElementUnion;
  setUrlState: ({ groupBy, formModel }: { groupBy: Group | {}; formModel: FormModelElement[] }) => void;
}
export const FilterActions = ({ backendQueryModel, dataSource, formModel, group, setUrlState }: Props): JSX.Element => {
  return (
    <Stack orientation="horizontal">
      <SaveFilterPopover
        backendQueryModel={backendQueryModel}
        dataSource={dataSource.toUpperCase() as DataSource}
        formModel={formModel}
        group={group}
      />
      &nbsp;
      <SavedFilters dataSource={dataSource.toUpperCase() as DataSource} setUrlState={setUrlState} />
    </Stack>
  );
};
