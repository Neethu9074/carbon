/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext } from 'react';

import { Application, Progress, Website } from '@instana/types';

import SloTableSelection from 'in-service-levels/components/Shared/SloTableSelection/SloTableSelection';
import SloFormContext from 'in-service-levels/components/ConfigDialog/createSloForm/SloFormContext';

export const SloEntityTablePageSize = 6;

export interface EntityData {
  id: string;
  label: string;
}

interface SloEntityTableProps {
  disabled?: boolean;
  entityList?: Application[] | Website[];
  onChange: (entityData: EntityData) => void;
  progress: Progress;
  canLoadMore?: boolean;
  loadMore?: () => void;
  hasError?: boolean;
}

export default function SloEntityTable({
  canLoadMore,
  disabled = false,
  entityList,
  hasError,
  loadMore,
  onChange,
  progress
}: SloEntityTableProps) {
  const { form } = useContext(SloFormContext);

  const entityId = form.getIn(['entity', 'entityId']).value;

  return (
    <SloTableSelection
      columns={['label']}
      onChange={onChange}
      progress={progress}
      selectedIds={[entityId]}
      canLoadMore={canLoadMore}
      disabled={disabled}
      hasError={hasError}
      itemList={entityList}
      loadMore={loadMore}
      asRadioButton
    />
  );
}
