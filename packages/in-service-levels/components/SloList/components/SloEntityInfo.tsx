/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import {
  ApplicationSloEntity,
  SloEntityType,
  SloEntityUnion,
  TagFilter,
  TagFilterExpression,
  isApplicationSloEntity
} from '@instana/types';
import { Stack, SvgIcon, Typography } from '@instana/components';

import { QueryBuilderComponent as QueryBuilderComponentType } from 'in-components/QueryBuilder';
import { useApplicationQueryBuilder } from 'in-service-levels/hooks/useApplicationQueryBuilder';
import QueryBuilderFilter from 'in-service-levels/components/QueryBuilderFilter';
import { LabeledEntity } from 'in-service-levels/types';
import Tooltip from 'in-components/Tooltip/Tooltip';
import useMediaQuery from 'in-hooks/useMediaQuery';
import { t } from 'in-i18n';

interface Props {
  entity: LabeledEntity;
  entityType?: SloEntityType;
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
  const { iconType, toolTipText } = getEntityDisplayData(entityType ?? (sloEntity?.type as SloEntityType), entity);
  const compact = useMediaQuery('(min-width: 600px)');
  const serviceEndpointInfo = (entityType || sloEntity?.type) === 'application';

  const applicationQueryBuilder = useApplicationQueryBuilder({} as ApplicationSloEntity);
  const QueryBuilder = sloEntity && isApplicationSloEntity(sloEntity) ? applicationQueryBuilder.QueryBuilder : null;

  const hasCustomFilter =
    sloEntity &&
    isApplicationSloEntity(sloEntity) &&
    ((sloEntity?.tagFilterExpression as TagFilterExpression)?.elements?.length > 0 ||
      (sloEntity?.tagFilterExpression as TagFilter).type === 'TAG_FILTER');

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
      {hasCustomFilter && QueryBuilder && <CustomFilter entity={sloEntity} QueryBuilderComponent={QueryBuilder} />}
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

interface CustomFilterProps {
  entity: SloEntityUnion;
  QueryBuilderComponent: QueryBuilderComponentType;
}

function CustomFilter({ entity, QueryBuilderComponent }: CustomFilterProps) {
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
