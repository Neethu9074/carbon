/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Spacer } from '@instana/components'; //not available in @instana/carbon
import { SloEntityType } from '@instana/types';
import { Stack } from '@instana/carbon';

import EntityTypeFilter from 'in-service-levels/components/SloList/components/EntityTypeFilter';
import SloTagFilter from 'in-service-levels/components/SloList/components/SloTagFilter';

import locals from './SloAlignContent.mless';

interface SloListFiltersProps {
  tags: string[];
  selectedTags: string[];
  entityType: SloEntityType | undefined;
  setFilter: (filter: Partial<{ entityType: SloEntityType | undefined; tags: string[] }>) => void;
}

export default function SloListFilters({ tags, selectedTags, entityType, setFilter }: SloListFiltersProps) {
  return (
    <Stack orientation="horizontal" gap="1rem" className={locals.stackAlignCenter}>
      <SloTagFilter tags={tags} value={selectedTags} onChange={value => setFilter({ tags: value })} />
      <EntityTypeFilter value={entityType} onChange={value => setFilter({ entityType: value })} />
      <Spacer />
    </Stack>
  );
}
