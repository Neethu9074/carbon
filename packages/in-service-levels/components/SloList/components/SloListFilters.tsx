/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Spacer, Stack } from '@instana/components';
import { SloEntityType } from '@instana/types';

import EntityTypeFilter from 'in-service-levels/components/SloList/components/EntityTypeFilter';
import SloTagFilter from 'in-service-levels/components/SloList/components/SloTagFilter';

interface Props {
  tags: string[];
  selectedTags: string[];
  entityType: SloEntityType | undefined;
  setFilter: (filter: Partial<{ entityType: SloEntityType | undefined; tags: string[] }>) => void;
  disabled?: boolean;

  // Creates a trailing gap to create space to following elements
  withTrailingGap?: boolean;
}
export default function SloListFilters({
  tags,
  selectedTags,
  entityType,
  setFilter,
  withTrailingGap,
  disabled
}: Props) {
  return (
    <Stack direction="horizontal">
      <SloTagFilter
        tags={tags}
        value={selectedTags}
        onChange={value => setFilter({ tags: value })}
        disabled={disabled}
      />
      <EntityTypeFilter value={entityType} onChange={value => setFilter({ entityType: value })} disabled={disabled} />
      {withTrailingGap && <Spacer />}
    </Stack>
  );
}
