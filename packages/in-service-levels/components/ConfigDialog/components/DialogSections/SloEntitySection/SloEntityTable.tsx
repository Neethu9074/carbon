/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext } from 'react';

import { Application, Progress, SyntheticTest, Website } from '@instana/types';

import SloTableSelection from 'in-service-levels/components/Shared/SloTableSelection/SloTableSelection';
import SloFormContext from 'in-service-levels/components/ConfigDialog/createSloForm/SloFormContext';

export const SloEntityTablePageSize = 6;

export interface EntityData {
  id: string;
  label: string;
}

export interface SyntheticTestWithId extends Omit<SyntheticTest, 'id'> {
  id: string;
}

interface SloEntityTableProps {
  asRadioButton?: boolean;
  canLoadMore?: boolean;
  disabled?: boolean;
  entityList?: Application[] | Website[] | SyntheticTestWithId[];
  hasError?: boolean;
  loadMore?: () => void;
  onChange: (entityData: EntityData) => void;
  progress: Progress;
}

export default function SloEntityTable({
  asRadioButton,
  canLoadMore,
  disabled = false,
  entityList,
  hasError,
  loadMore,
  onChange,
  progress
}: SloEntityTableProps) {
  const { form } = useContext(SloFormContext);

  const entityIds = form.getIn(['entity', 'entityIds']).value;

  return (
    <SloTableSelection
      asRadioButton={asRadioButton}
      canLoadMore={canLoadMore}
      columns={['label']}
      disabled={disabled}
      hasError={hasError}
      itemList={entityList}
      loadMore={loadMore}
      onChange={onChange}
      progress={progress}
      selectedIds={entityIds}
    />
  );
}
