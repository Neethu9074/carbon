/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useContext, useState } from 'react';

import { Typography, ValidationBlock } from '@instana/components';
import { Search } from '@instana/carbon';

import SloEntityTable, {
  EntityData,
  SloEntityTablePageSize,
  SyntheticTestWithId
} from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloEntitySection/SloEntityTable';
import SloTableHeader from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloEntitySection/SloTableHeader';
import useSyntheticTestsCursorPaginated from 'in-service-levels/hooks/useSyntheticTestsCursorPaginated';
import SloFormContext from 'in-service-levels/components/ConfigDialog/createSloForm/SloFormContext';
import useSyntheticTests from 'in-service-levels/hooks/useSyntheticTests';
import Sections from 'in-components/workspace/Sections/Sections';
import { isFieldValid } from 'in-service-levels/utils/form';
import { finishedProgress } from 'in-services/fixedObjects';
import useDebouncedValue from 'in-hooks/useDebouncedValue';
import { all } from 'in-hooks/utils/progress';
import { t } from 'in-i18n';

export default function SloSynthethicEntitySection() {
  const { form, mode, onChange } = useContext(SloFormContext);
  const [query, setQuery] = useState('');
  const {
    value: queryInput,
    debouncedValue: debouncedQuery,
    onChange: setQueryDebounced
  } = useDebouncedValue(query, setQuery);

  const sloEntityTypeField = form.getIn(['entity', 'type']);
  const entityIdsField = form.getIn(['entity', 'entityIds']);
  const entityIds = entityIdsField.value;
  const isEntityIdsFieldValid = isFieldValid(entityIdsField);

  const isEditMode = mode === 'EDIT';

  const [separatelyLoadedEntities, , , labelProgress] = useSyntheticTests({ testIds: entityIds });
  const [entityResult, , , entitiesProgress] = useSyntheticTestsCursorPaginated(
    { query: debouncedQuery, skip: isEditMode },
    SloEntityTablePageSize
  );

  const entityList = entityResult?.tests;
  const { canLoadMore, loadMore } = entityResult ?? {};

  const onEntityChange = ({ id }: EntityData) => {
    const alreadySelected = entityIds.includes(id);
    const newEntityIds = alreadySelected ? entityIds.filter(entityId => entityId !== id) : [...entityIds, id];
    onChange(['entity', 'entityIds'], () => entityIdsField.setValue(newEntityIds).setTouched(true));
  };

  const sortedEntities = [
    ...(separatelyLoadedEntities ?? []),
    ...(entityList?.filter(({ id }) => !entityIds.includes(id!)) ?? [])
  ].filter(Boolean) as SyntheticTestWithId[];

  const progress = all(!entityIds ? finishedProgress : labelProgress, entitiesProgress);

  return (
    <Sections>
      <SloTableHeader>
        <Typography variant="heading-200" component="h2">
          {t('in-service-levels:general.select', { entity: sloEntityTypeField.value })}
        </Typography>
        {!isEditMode && (
          <div>
            <Search
              labelText=""
              onChange={event => setQueryDebounced(event.target.value)}
              placeholder={t('in-components:searchInput.placeholderSearch')}
              size="sm"
              value={queryInput}
            />
          </div>
        )}
      </SloTableHeader>
      {!isEntityIdsFieldValid &&
        entityIdsField.messages.map(({ message, path }, index) => (
          <ValidationBlock key={`${path}:${index}`}>{message}</ValidationBlock>
        ))}
      <SloEntityTable
        canLoadMore={canLoadMore}
        entityList={sortedEntities}
        hasError={!isEntityIdsFieldValid}
        loadMore={loadMore}
        onChange={onEntityChange}
        progress={progress}
        disabled={isEditMode}
      />
    </Sections>
  );
}
