/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import {
  ApplicationSloEntity,
  isApplicationSloEntity,
  isSyntheticSloEntity,
  isWebsiteSloEntity,
  ServiceLevelIndicatorUnion,
  SloEntityUnion,
  WebsiteSloEntity
} from '@instana/types';
import { Spacer, Stack, SvgIcon, Typography } from '@instana/components';

import { useApplicationQueryBuilder } from 'in-service-levels/hooks/useApplicationQueryBuilder';
import { useWebsiteQueryBuilder } from 'in-service-levels/hooks/useWebsiteQueryBuilder';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import { createGoodBadTagFilterExpression } from 'in-service-levels/utils/tagFilter';
import type { QueryBuilderComponent } from 'in-components/QueryBuilder';
import { ServiceLevelErrors } from 'in-service-levels/constants';
import Tooltip from 'in-components/Tooltip/Tooltip';
import { t } from 'in-i18n';

interface FilterInfoProps {
  entity: SloEntityUnion;
  indicator: ServiceLevelIndicatorUnion;
}
export default function FilterInfo({ entity, indicator }: FilterInfoProps) {
  let content = undefined;
  if (isSyntheticSloEntity(entity)) {
    content = <></>;
  } else if (isApplicationSloEntity(entity)) {
    content = <ApplicationFilterInfoContent entity={entity} indicator={indicator} />;
  } else if (isWebsiteSloEntity(entity)) {
    content = <WebsiteFilterInfoContent entity={entity} indicator={indicator} />;
  } else {
    throw new Error(ServiceLevelErrors.UNHANDLED_SLO_ENTITY_TYPE);
  }

  return (
    <Tooltip content={content} themeStyle="light" align="bottomRight">
      <SvgIcon type="lib_help_error_info_outline" />
    </Tooltip>
  );
}

function ApplicationFilterInfoContent({ entity, indicator }: FilterInfoProps & { entity: ApplicationSloEntity }) {
  const { QueryBuilder } = useApplicationQueryBuilder(entity);
  return <FilterInfoContent entity={entity} indicator={indicator} QueryBuilderComponent={QueryBuilder} />;
}

function WebsiteFilterInfoContent({ entity, indicator }: FilterInfoProps & { entity: WebsiteSloEntity }) {
  const { QueryBuilder } = useWebsiteQueryBuilder(entity);
  return <FilterInfoContent entity={entity} indicator={indicator} QueryBuilderComponent={QueryBuilder} />;
}

function FilterInfoContent({
  entity,
  indicator,
  QueryBuilderComponent
}: FilterInfoProps & { QueryBuilderComponent: QueryBuilderComponent }) {
  const { good, bad } = createGoodBadTagFilterExpression({ entity, indicator });
  return (
    <Stack gap="disabled">
      <Typography variant="heading-100" component="h5">
        {t('in-service-levels:sloDashboard.components.indicatorChart.components.filterInfo.goodEventFilters')}
      </Typography>
      <QueryBuilderComponent value={fromBackendModel(good)} readOnly />
      <Spacer size="normal" />
      <Typography variant="heading-100" component="h5">
        {t('in-service-levels:sloDashboard.components.indicatorChart.components.filterInfo.badEventFilters')}
      </Typography>
      <QueryBuilderComponent value={fromBackendModel(bad)} readOnly />
    </Stack>
  );
}
