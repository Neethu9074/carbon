/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useCallback } from 'react';

import { BlueprintType, InquiryResult, ServiceLevelObjectiveConfiguration, SloEntityType } from '@instana/types';
import { Accordion, AccordionItem, DismissibleTag, Stack } from '@instana/carbon';

import EntityTypeFilter from 'in-service-levels/components/SloList/components/EntityTypeFilter';
import SloStatusFilter from 'in-service-levels/components/SloList/components/SloStatusFilter';
import BlueprintFilter from 'in-service-levels/components/SloList/components/BlueprintFilter';
import SloTagFilter from 'in-service-levels/components/SloList/components/SloTagFilter';
import { SloStatus } from 'in-service-levels/types';
import { t } from 'in-i18n';

import locals from './SloListFilters.mless';

export type SloListFilterPartialProps = Partial<{
  blueprint: BlueprintType | undefined;
  entityType: SloEntityType | undefined;
  tags: string[];
  sloStatus: SloStatus | undefined;
}>;

interface SloListFiltersProps {
  tags: string[];
  selectedTags: string[];
  sloStatus: SloStatus | undefined;
  entityType: SloEntityType | undefined;
  blueprint: BlueprintType | undefined;
  setFilter: (filter: SloListFilterPartialProps) => void;
  groups: InquiryResult<ServiceLevelObjectiveConfiguration> | undefined;
}

export default function SloListFilters({
  tags,
  selectedTags,
  entityType,
  sloStatus,
  blueprint,
  setFilter,
  groups
}: SloListFiltersProps) {
  const onStatusChange = useCallback(
    (value: SloStatus | '') => setFilter({ sloStatus: value !== '' ? value : undefined }),
    [setFilter]
  );
  const onTagsChange = useCallback((value: string[]) => setFilter({ tags: value }), [setFilter]);
  const onBlueprintChange = useCallback(
    (value: BlueprintType | '') => setFilter({ blueprint: value !== '' ? value : undefined }),
    [setFilter]
  );
  const onEntityTypeChange = useCallback(
    (value: SloEntityType | '') => setFilter({ entityType: value !== '' ? value : undefined }),
    [setFilter]
  );
  return (
    <Accordion className={locals['slo-filters-accordion']}>
      <AccordionItem
        open={!!sloStatus}
        className={locals['slo-filters-accordion-item']}
        title={
          <Stack orientation="horizontal" className={locals['slo-filters-accordian-item-header']}>
            {t('in-service-levels:sloList.components.sloListFilters.filterStatus')}
            {sloStatus && <DismissibleTag size="sm" text={'1'} onClose={() => onStatusChange('')} />}
          </Stack>
        }
      >
        <SloStatusFilter groups={groups} value={sloStatus} onChange={onStatusChange} />
      </AccordionItem>
      <AccordionItem
        open={!!selectedTags?.length}
        className={locals['slo-filters-accordion-item']}
        title={
          <Stack orientation="horizontal" className={locals['slo-filters-accordian-item-header']}>
            {t('in-service-levels:sloList.components.sloListFilters.filterTags')}
            {selectedTags.length > 0 && (
              <DismissibleTag size="sm" text={`${selectedTags.length}`} onClose={() => onTagsChange([])} />
            )}
          </Stack>
        }
      >
        <SloTagFilter tags={tags} value={selectedTags} onChange={onTagsChange} />
      </AccordionItem>
      <AccordionItem
        open={!!blueprint}
        className={locals['slo-filters-accordion-item']}
        title={
          <Stack orientation="horizontal" className={locals['slo-filters-accordian-item-header']}>
            {t('in-service-levels:sloList.components.sloListFilters.filterBlueprint')}

            {blueprint && <DismissibleTag size="sm" text={'1'} onClose={() => onBlueprintChange('')} />}
          </Stack>
        }
      >
        <BlueprintFilter groups={groups} value={blueprint} onChange={onBlueprintChange} />
      </AccordionItem>
      <AccordionItem
        open={!!entityType}
        className={locals['slo-filters-accordion-item']}
        title={
          <Stack orientation="horizontal" className={locals['slo-filters-accordian-item-header']}>
            {t('in-service-levels:sloList.components.sloListFilters.filterEntity')}
            {entityType && <DismissibleTag size="sm" text={'1'} onClose={() => onEntityTypeChange('')} />}
          </Stack>
        }
      >
        <EntityTypeFilter groups={groups} value={entityType} onChange={onEntityTypeChange} />
      </AccordionItem>
    </Accordion>
  );
}
