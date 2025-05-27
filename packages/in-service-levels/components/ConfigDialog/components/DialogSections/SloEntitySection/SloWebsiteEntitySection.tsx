/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext, useState } from 'react';

import { Typography, ValidationBlock } from '@instana/components';
import { Website } from '@instana/types';
import { Search } from '@instana/carbon';

import SloEntityTable, {
  EntityData,
  SloEntityTablePageSize
} from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloEntitySection/SloEntityTable';
import SloTableHeader from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloEntitySection/SloTableHeader';
import SloFormContext from 'in-service-levels/components/ConfigDialog/createSloForm/SloFormContext';
import { isFieldValid } from 'in-service-levels/components/ConfigDialog/createSloForm/utils';
import useWebsiteEntities from 'in-service-levels/hooks/useWebsiteEntities';
import Sections from 'in-components/workspace/Sections/Sections';
import { finishedProgress } from 'in-services/fixedObjects';
import useDebouncedValue from 'in-hooks/useDebouncedValue';
import useWebsite from 'in-websites/hooks/useWebsite';
import { all } from 'in-hooks/utils/progress';
import { t } from 'in-i18n';

export default function SloWebsiteEntitySection() {
  const { form, onChange } = useContext(SloFormContext);
  const [query, setQuery] = useState('');
  const {
    value: queryInput,
    debouncedValue: debouncedQuery,
    onChange: setQueryDebounced
  } = useDebouncedValue(query, setQuery);

  const entityTypeField = form.getIn(['entity', 'type']);
  const entityIdField = form.getIn(['entity', 'entityIds']);
  const entityId = entityIdField.value[0];

  const [separatelyLoadedEntity, , , labelProgress] = useWebsite(entityId);
  const [entityResult, , , entitiesProgress] = useWebsiteEntities({
    query: debouncedQuery,
    options: { retrievalSize: SloEntityTablePageSize }
  });

  const entityList = entityResult?.entities;
  const { canLoadMore, loadMore } = entityResult ?? {};

  // If entityList already contains the selected entity then we can avoid waiting for the extra loading operation for entity
  const previouslyLoadedEntity = entityList?.find(({ id }) => id === entityId);
  const entityAlreadyLoaded = Boolean(previouslyLoadedEntity);

  const isEntityIdFieldValid = isFieldValid(entityIdField);

  const onEntityChange = ({ id }: EntityData) => {
    onChange(['entity', 'entityIds'], () => entityIdField.setValue([id]).setTouched(true));
  };

  const sortedEntities = [
    previouslyLoadedEntity ?? separatelyLoadedEntity,
    ...(entityList?.filter(({ id }) => id !== entityId) ?? [])
  ].filter(Boolean) as Website[];

  const progress = all(entityAlreadyLoaded || !entityId ? finishedProgress : labelProgress, entitiesProgress);

  return (
    <Sections>
      <SloTableHeader>
        <Typography variant="heading-200" component="h2">
          {t('in-service-levels:general.select', { entity: entityTypeField.value })}
        </Typography>
        <div>
          <Search
            labelText=""
            value={queryInput}
            onChange={event => setQueryDebounced(event.target.value)}
            placeholder={t('in-components:searchInput.placeholderSearch')}
            size="sm"
          />
        </div>
      </SloTableHeader>
      {!isEntityIdFieldValid &&
        entityIdField.messages.map(({ message, path }, index) => (
          <ValidationBlock key={`${path}:${index}`}>{message}</ValidationBlock>
        ))}
      <SloEntityTable
        asRadioButton
        canLoadMore={canLoadMore}
        entityList={sortedEntities}
        hasError={!isEntityIdFieldValid}
        loadMore={loadMore}
        onChange={onEntityChange}
        progress={progress}
      />
    </Sections>
  );
}
