/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useState } from 'react';

import { Group, TagFilterExpressionElementUnion, DataSource, SavedFilter, Result } from '@instana/types';
import { CarbonStack as Stack } from '@instana/components';
import { useObservable } from '@instana/hooks';

import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { SaveFilterPopover } from 'in-components/SaveFilters/SaveFilterPopover';
import { SavedFilters } from 'in-components/SaveFilters/SavedFilters';
import { getSavedFilters } from 'in-applications/api/filters';
import { pendingResult } from 'in-services/fixedObjects';

export type SetFilterUrlState = ({
  groupBy,
  formModel
}: {
  groupBy: Group | {};
  formModel: FormModelElement[];
}) => void;

interface Props {
  dataSource: DataSource;
  group: Group;
  formModel: FormModelElement[];
  backendQueryModel: TagFilterExpressionElementUnion;
  setUrlState: SetFilterUrlState;
}
export const FilterActions = ({ backendQueryModel, dataSource, formModel, group, setUrlState }: Props): JSX.Element => {
  const [filterToEdit, setFilterToEdit] = useState<SavedFilter | null>();
  const result = useObservable(() => getSavedFilters(), []) ?? (pendingResult as Result<SavedFilter[]>);
  return (
    <Stack orientation="horizontal">
      <SaveFilterPopover
        backendQueryModel={backendQueryModel}
        dataSource={dataSource.toUpperCase() as DataSource}
        filterToEdit={filterToEdit}
        formModel={formModel}
        group={group}
        result={result}
        setFilterToEdit={setFilterToEdit}
      />
      &nbsp;
      <SavedFilters
        dataSource={dataSource.toUpperCase() as DataSource}
        setUrlState={setUrlState}
        setFilterToEdit={setFilterToEdit}
        result={result}
      />
    </Stack>
  );
};
