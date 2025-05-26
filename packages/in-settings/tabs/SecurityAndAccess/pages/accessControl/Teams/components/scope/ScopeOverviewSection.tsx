/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { ContainedList, ContainedListItem } from '@instana/carbon';
import { TagSet } from '@instana/ibm-products';

import { ScopeAreaSection } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/scope/ScopeOverview.types';
import useScopeEntityMapping from 'in-settings/tabs/SecurityAndAccess/hooks/useScopeEntityMapping';

import locals from './ScopeOverviewSection.mless';

export interface ScopeOverviewSectionProps<I> {
  areaId: string;
  section: ScopeAreaSection<I>;
}

const ScopeOverviewSection = <I,>({ areaId, section }: ScopeOverviewSectionProps<I>) => {
  const scopeEntities = useScopeEntityMapping<I>({
    entityIds: section.items ?? [],
    extractId: section.extractId,
    extractName: section.extractName,
    observable: section.observable
  });

  return (
    <ContainedList
      key={`${areaId}-${section.id}`}
      label={section.title ?? ''}
      className={section.title ? undefined : locals.hideTitle}
    >
      {section?.displayType === 'tagSet' && (
        <ContainedListItem>
          <TagSet
            overflowType="tag"
            tags={scopeEntities.map((item: I) => {
              return { label: section.extractName(item), type: 'high-contrast' };
            })}
          />
        </ContainedListItem>
      )}
      {(!section?.displayType || section?.displayType === 'list') &&
        scopeEntities.map((item: I) => {
          return (
            <ContainedListItem key={`${section.id}-${section.extractId(item)}`}>
              {section.extractName(item)}
            </ContainedListItem>
          );
        })}
    </ContainedList>
  );
};

export default ScopeOverviewSection;
