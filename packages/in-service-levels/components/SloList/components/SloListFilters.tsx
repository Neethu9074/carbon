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

interface SloListFiltersProps {
  tags: string[];
  selectedTags: string[];
  entityType: SloEntityType | undefined;
  setFilter: (filter: Partial<{ entityType: SloEntityType | undefined; tags: string[] }>) => void;
}

export default function SloListFilters({ tags, selectedTags, entityType, setFilter }: SloListFiltersProps) {
  return (
    <Stack direction="horizontal">
      <SloTagFilter tags={tags} value={selectedTags} onChange={value => setFilter({ tags: value })} />
      <EntityTypeFilter value={entityType} onChange={value => setFilter({ entityType: value })} />
      <Spacer />
    </Stack>
  );
}
