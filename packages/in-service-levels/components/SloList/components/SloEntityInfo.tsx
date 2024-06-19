/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import {
  ApplicationSloEntity,
  SloEntityType,
  SloEntityUnion,
  WebsiteSloEntity,
  isApplicationSloEntity,
  isTagFilter,
  isWebsiteSloEntity
} from '@instana/types';
import { Stack, SvgIcon, Typography } from '@instana/components';

import { QueryBuilderComponent as QueryBuilderComponentType } from 'in-components/QueryBuilder';
import { useApplicationQueryBuilder } from 'in-service-levels/hooks/useApplicationQueryBuilder';
import { isEmptyExpression } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { useWebsiteQueryBuilder } from 'in-service-levels/hooks/useWebsiteQueryBuilder';
import QueryBuilderFilter from 'in-service-levels/components/QueryBuilderFilter';
import { ServiceLevelErrors } from 'in-service-levels/constants';
import { LabeledEntity } from 'in-service-levels/types';
import Tooltip from 'in-components/Tooltip/Tooltip';
import useMediaQuery from 'in-hooks/useMediaQuery';
import { t } from 'in-i18n';

interface Props {
  entity: LabeledEntity;
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

export default function SloEntityInfo({ entity, entityType, service, endpoint, metaInfo = false, sloEntity }: Props) {
  const { iconType, toolTipText } = getEntityDisplayData(entityType, entity);
  const compact = useMediaQuery('(min-width: 600px)');
  const serviceEndpointInfo = (entityType || sloEntity?.type) === 'application';

  const hasCustomFilter =
    sloEntity?.tagFilterExpression &&
    isApplicationSloEntity(sloEntity) &&
    (!isEmptyExpression(sloEntity.tagFilterExpression) || isTagFilter(sloEntity.tagFilterExpression));

  const showServiceEndpointInfo = metaInfo && serviceEndpointInfo && compact && !hasCustomFilter;
  return (
    <Stack direction="horizontal" align="center">
      <Stack direction="horizontal" align="center" gap="xxsmall">
        <Tooltip content={toolTipText}>
          <SvgIcon type={iconType} aria-label={toolTipText} />
        </Tooltip>
        <Typography variant="body-regular">{entity.label}</Typography>
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

function getEntityDisplayData(entityType: SloEntityType, entity: LabeledEntity): EntityDisplayData {
  return {
    iconType: entity.deleted ? 'lib_infra_unknownIcon' : `lib_${entityType}`,
    toolTipText: t('in-service-levels:sloList.components.sloEntityInfo.tooltip', {
      context: entityType
    })
  };
}

interface CustomQueryFilterProps {
  entity: SloEntityUnion;
  QueryBuilderComponent: QueryBuilderComponentType;
}

function CustomQueryFilter({ entity, QueryBuilderComponent }: CustomQueryFilterProps) {
  return (
    <Tooltip
      content={<QueryBuilderFilter entity={entity} QueryBuilderComponent={QueryBuilderComponent} />}
      themeStyle="light"
      align="topMiddle"
    >
      <span>{t('in-service-levels:sloDashboard.components.scopeSection.customFilterLabel')}</span>
    </Tooltip>
  );
}

interface CustomFilterProps {
  entity: SloEntityUnion;
}
function CustomFilter({ entity }: CustomFilterProps) {
  const tagFilterExpression = entity?.tagFilterExpression;
  const isApplicationEntity = isApplicationSloEntity(entity);
  const isWebsiteEntity = isWebsiteSloEntity(entity);

  if (tagFilterExpression && isApplicationEntity) return <ApplicationCustomFilter entity={entity} />;
  if (tagFilterExpression && isWebsiteEntity) return <WebsiteCustomFilter entity={entity} />;

  throw new Error(ServiceLevelErrors.UNHANDLED_SLO_ENTITY_TYPE);
}

interface ApplicationCustomFiltersProps {
  entity: ApplicationSloEntity;
}
function ApplicationCustomFilter({ entity }: ApplicationCustomFiltersProps) {
  const applicationQueryBuilder = useApplicationQueryBuilder(entity);
  const { QueryBuilder } = applicationQueryBuilder;
  return <CustomQueryFilter entity={entity} QueryBuilderComponent={QueryBuilder} />;
}

interface WebsiteCustomFiltersProps {
  entity: WebsiteSloEntity;
}
function WebsiteCustomFilter({ entity }: WebsiteCustomFiltersProps) {
  const websiteQueryBuilder = useWebsiteQueryBuilder(entity);
  const { QueryBuilder } = websiteQueryBuilder;
  return <CustomQueryFilter entity={entity} QueryBuilderComponent={QueryBuilder} />;
}
