/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import {
  ApplicationSloEntity,
  SloEntityType,
  SloEntityUnion,
  isApplicationSloEntity,
  isTagFilter
} from '@instana/types';
import { Typography, SvgIcon } from '@instana/components';
import { Stack } from '@instana/carbon';

import { useApplicationQueryBuilder } from 'in-service-levels/hooks/useApplicationQueryBuilder';
import { isEmptyExpression } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import MultiEntityLabel from 'in-service-levels/components/Shared/MultiEntityLabel';
import QueryBuilderFilter from 'in-service-levels/components/QueryBuilderFilter';
import { ServiceLevelErrors } from 'in-service-levels/constants';
import { LabeledEntity } from 'in-service-levels/types';
import Tooltip from 'in-components/Tooltip/Tooltip';
import useMediaQuery from 'in-hooks/useMediaQuery';
import { t } from 'in-i18n';

import locals from 'in-service-levels/styles/SloAlignContent.mless';

interface Props {
  entities: LabeledEntity[];
  entityType: SloEntityType;
  service?: LabeledEntity;
  endpoint?: LabeledEntity;
  metaInfo?: boolean;
  sloEntity?: SloEntityUnion;
}

type EntityDisplayData = {
  iconType: string;
  toolTipText: string;
};

export default function SloEntityInfo({ entities, entityType, service, endpoint, metaInfo, sloEntity }: Props) {
  const { iconType, toolTipText } = getEntityDisplayData(entityType, entities);
  const compact = useMediaQuery('(min-width: 600px)');
  const serviceEndpointInfo = entityType === 'application';

  const hasCustomFilter =
    sloEntity?.tagFilterExpression &&
    isApplicationSloEntity(sloEntity) &&
    (!isEmptyExpression(sloEntity.tagFilterExpression) || isTagFilter(sloEntity.tagFilterExpression));

  const showServiceEndpointInfo = metaInfo && serviceEndpointInfo && compact && !hasCustomFilter;

  const hasMultipleEntities = entities.length > 1;

  return (
    <Stack orientation="horizontal" className={locals.stackAlignCenter} gap={4}>
      <Stack orientation="horizontal" className={locals.stackAlignCenter}>
        <Tooltip content={toolTipText}>
          <SvgIcon type={iconType} aria-label={toolTipText} />
        </Tooltip>
        {!hasMultipleEntities && <Typography variant="body-regular">{entities[0].label}</Typography>}
        {hasMultipleEntities && (
          <MultiEntityLabel
            entityType={entityType === 'synthetic' ? 'test' : entityType}
            labels={entities.map(({ label }) => label)}
          />
        )}
      </Stack>
      {showServiceEndpointInfo && (
        <Typography variant="body-small">
          {t('in-service-levels:sloList.components.sloEntityInfo.service', {
            label: service?.label ?? t('in-service-levels:sloDashboard.components.scopeSection.apAllServices')
          })}
        </Typography>
      )}
      {showServiceEndpointInfo && (
        <Typography variant="body-small">
          {t('in-service-levels:sloList.components.sloEntityInfo.endpoint', {
            label: endpoint?.label ?? t('in-service-levels:sloDashboard.components.scopeSection.apAllEndpoints')
          })}
        </Typography>
      )}
      {hasCustomFilter && <CustomFilter entity={sloEntity} />}
    </Stack>
  );
}

function getEntityDisplayData(entityType: SloEntityType, entities: LabeledEntity[]): EntityDisplayData {
  if (entityType === 'synthetic')
    return {
      iconType: 'lib_synthetic',
      toolTipText: t('in-service-levels:sloList.components.sloEntityInfo.tooltip', {
        context: 'synthetic'
      })
    };
  return {
    iconType: entities[0].deleted ? 'lib_infra_unknownIcon' : `lib_${entityType}`,
    toolTipText: t('in-service-levels:sloList.components.sloEntityInfo.tooltip', {
      context: entityType
    })
  };
}
interface CustomFilterProps {
  entity: SloEntityUnion;
}

function CustomFilter({ entity }: CustomFilterProps) {
  const tagFilterExpression = entity?.tagFilterExpression;
  const isApplicationEntity = isApplicationSloEntity(entity);

  if (tagFilterExpression && isApplicationEntity) return <ApplicationCustomFilter entity={entity} />;

  throw new Error(ServiceLevelErrors.UNHANDLED_SLO_ENTITY_TYPE);
}

interface ApplicationCustomFiltersProps {
  entity: ApplicationSloEntity;
}

function ApplicationCustomFilter({ entity }: ApplicationCustomFiltersProps) {
  const applicationQueryBuilder = useApplicationQueryBuilder(entity);
  const { QueryBuilder } = applicationQueryBuilder;
  return (
    <Tooltip
      content={<QueryBuilderFilter entity={entity} QueryBuilderComponent={QueryBuilder} />}
      themeStyle="light"
      align="topMiddle"
    >
      <span>{t('in-service-levels:sloDashboard.components.scopeSection.customFilterLabel')}</span>
    </Tooltip>
  );
}
