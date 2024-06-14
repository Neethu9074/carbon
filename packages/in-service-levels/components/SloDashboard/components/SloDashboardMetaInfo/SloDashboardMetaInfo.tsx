/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import {
  ApplicationSloEntity,
  ServiceLevelObjectiveConfiguration,
  TagFilterExpression,
  WebsiteSloEntity,
  isApplicationSloEntity
} from '@instana/types';
import { Stack } from '@instana/components';
import { t } from '@instana/i18n-react';

import { useApplicationQueryBuilder } from 'in-service-levels/hooks/useApplicationQueryBuilder';
import { QueryBuilderComponent as QueryBuilderComponentType } from 'in-components/QueryBuilder';
import SloEntityInfo from 'in-service-levels/components/SloList/components/SloEntityInfo';
import { useWebsiteQueryBuilder } from 'in-service-levels/hooks/useWebsiteQueryBuilder';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import { LabeledEntity } from 'in-service-levels/types';
import TagList from 'in-components/TagsList/TagList';
import useMediaQuery from 'in-hooks/useMediaQuery';
import Tooltip from 'in-components/Tooltip';

import locals from './SloDashboardMetaInfo.mless';

interface SloDashboardMetaInfoProps {
  configuration: ServiceLevelObjectiveConfiguration;
  entity?: LabeledEntity;
  service?: LabeledEntity;
  endpoint?: LabeledEntity;
}

export default function SloDashboardMetaInfo({ configuration, entity, service, endpoint }: SloDashboardMetaInfoProps) {
  const showTag = useMediaQuery('(min-width: 1200px)');

  const { tags, entity: sloEntity } = configuration;
  const hasCustomFilter =
    isApplicationSloEntity(sloEntity) && (sloEntity?.tagFilterExpression as TagFilterExpression)?.elements.length > 0;

  const applicationQueryBuilder = useApplicationQueryBuilder(sloEntity as ApplicationSloEntity);
  const websiteQueryBuilder = useWebsiteQueryBuilder(sloEntity as WebsiteSloEntity);

  const QueryBuilder = isApplicationSloEntity(sloEntity)
    ? applicationQueryBuilder.QueryBuilder
    : websiteQueryBuilder.QueryBuilder;
  return (
    <div className={locals.metaInfo}>
      <Stack direction="horizontal" align="center" distribution="start">
        {entity && (
          <SloEntityInfo
            entity={entity}
            entityType={sloEntity.type}
            hasCustomFilter={hasCustomFilter}
            service={service}
            endpoint={endpoint}
            metaInfo
          />
        )}
        {hasCustomFilter && <CustomFilter configuration={configuration} QueryBuilderComponent={QueryBuilder} />}
        {showTag && <TagList tags={tags} />}
      </Stack>
    </div>
  );
}
interface CustomFilterProps {
  configuration: ServiceLevelObjectiveConfiguration;
  QueryBuilderComponent: QueryBuilderComponentType;
}

function CustomFilter({ configuration, QueryBuilderComponent }: CustomFilterProps) {
  const { entity } = configuration;
  const { tagFilterExpression } = entity;

  if (!tagFilterExpression) return null;

  return (
    <Tooltip
      content={<QueryBuilderComponent value={fromBackendModel(tagFilterExpression)} readOnly />}
      themeStyle="light"
      align="topMiddle"
    >
      <span>{t('in-service-levels:sloDashboard.components.scopeSection.customFilterLabel')}</span>
    </Tooltip>
  );
}
