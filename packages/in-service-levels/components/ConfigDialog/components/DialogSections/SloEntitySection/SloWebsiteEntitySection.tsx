/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext, useState } from 'react';

import { Card } from '@instana/components';
import { Website } from '@instana/types';

import SloEntityTable, {
  EntityData
} from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloEntitySection/SloEntityTable';
import SloFormContext from 'in-service-levels/components/ConfigDialog/createSloForm/SloFormContext';
import useEntityConfigurations from 'in-service-levels/hooks/useEntityConfigurations';
import SearchInput from 'in-components/SearchInput/SearchInput';
import { finishedProgress } from 'in-services/fixedObjects';
import useWebsite from 'in-websites/hooks/useWebsite';
import { all } from 'in-hooks/utils/progress';
import { t } from 'in-i18n';

export default function SloWebsiteEntitySection() {
  const { form, onChange } = useContext(SloFormContext);
  const [query, setQuery] = useState('');

  const entityTypeField = form.getIn(['entity', 'type']);
  const websiteIdField = form.getIn(['entity', 'entityId']);
  const entityId = websiteIdField.value;

  const [separatelyLoadedEntity, , , labelProgress] = useWebsite(entityId);
  const [entityList, , , entitiesProgress] = useEntityConfigurations(entityTypeField.value);

  // If entityList already contains the selected entity then we can avoid waiting for the extra loading operation for entity
  const previouslyLoadedEntity = entityList?.find(({ id }) => id === entityId);
  const entityAlreadyLoaded = Boolean(previouslyLoadedEntity);

  const onEntityChange = ({ id }: EntityData) => {
    onChange(['entity', 'entityId'], () => websiteIdField.setValue(id).setTouched(true));
  };

  const sortedEntities = [
    previouslyLoadedEntity ?? separatelyLoadedEntity,
    ...(entityList?.filter(({ id }) => id !== entityId) ?? [])
  ].filter(Boolean) as Website[];

  const progress = all(entityAlreadyLoaded || !entityId ? finishedProgress : labelProgress, entitiesProgress);

  return (
    <Card
      title={t('in-service-levels:general.select', { entity: entityTypeField.value })}
      rightHeaderContent={<SearchInput query={query} onChange={q => setQuery(q)} />}
    >
      <SloEntityTable entityList={sortedEntities} onChange={onEntityChange} progress={progress} query={query} />
    </Card>
  );
}
