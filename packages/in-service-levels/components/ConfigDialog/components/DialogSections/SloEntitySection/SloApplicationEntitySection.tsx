/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext, useState } from 'react';

import { Application } from '@instana/types';
import { Card } from '@instana/components';

import SloEntityTable, {
  EntityData,
  SloEntityTablePageSize
} from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloEntitySection/SloEntityTable';
import SloFormContext from 'in-service-levels/components/ConfigDialog/createSloForm/SloFormContext';
import useApplicationEntities from 'in-service-levels/hooks/useApplicationEntities';
import { isFieldValid } from 'in-service-levels/components/ConfigDialog/createSloForm/utils';
import ValidationBlock from 'in-components/form/ValidationBlock/ValidationBlock';
import SearchInput from 'in-components/SearchInput/SearchInput';
import { finishedProgress } from 'in-services/fixedObjects';
import useDebouncedValue from 'in-hooks/useDebouncedValue';
import { all } from 'in-hooks/utils/progress';
import { t } from 'in-i18n';
import useApplication from 'in-applications/hooks/useApplication';

export default function SloApplicationEntitySection() {
  const { form, onChange } = useContext(SloFormContext);
  const [query, setQuery] = useState('');
  const {
    value: queryInput,
    debouncedValue: debouncedQuery,
    onChange: setQueryDebounced
  } = useDebouncedValue(query, setQuery);

  const sloEntityTypeField = form.getIn(['entity', 'type']);
  const entityIdField = form.getIn(['entity', 'entityId']);
  const entityId = entityIdField.value;
  const isEntityIdFieldValid = isFieldValid(entityIdField);

  const [separatelyLoadedEntity, , , labelProgress] = useApplication(entityId);
  const [entityResult, , , entitiesProgress] = useApplicationEntities({
    query: debouncedQuery,
    options: { retrievalSize: SloEntityTablePageSize }
  });

  const entityList = entityResult?.entities;
  const { canLoadMore, loadMore } = entityResult ?? {};

  // If entityList already contains the selected entity then we can avoid waiting for the extra loading operation for entity
  const previouslyLoadedEntity = entityList?.find(({ id }) => id === entityId);
  const entityAlreadyLoaded = Boolean(previouslyLoadedEntity);

  const onEntityChange = ({ id }: EntityData) => {
    onChange(['entity', 'entityId'], () => entityIdField.setValue(id).setTouched(true));
  };

  const sortedEntities = [
    previouslyLoadedEntity ?? separatelyLoadedEntity,
    ...(entityList?.filter(({ id }) => id !== entityId) ?? [])
  ].filter(Boolean) as Application[];

  const progress = all(entityAlreadyLoaded || !entityId ? finishedProgress : labelProgress, entitiesProgress);

  return (
    <Card
      title={t('in-service-levels:general.select', { entity: sloEntityTypeField.value })}
      rightHeaderContent={<SearchInput query={queryInput} onChange={q => setQueryDebounced(q)} />}
    >
      <>
        {!isEntityIdFieldValid &&
          entityIdField.messages.map(({ message, path }, index) => (
            <ValidationBlock key={`${path}:${index}`}>{message}</ValidationBlock>
          ))}
        <SloEntityTable
          hasError={!isEntityIdFieldValid}
          entityList={sortedEntities}
          onChange={onEntityChange}
          progress={progress}
          canLoadMore={canLoadMore}
          loadMore={loadMore}
        />
      </>
    </Card>
  );
}
