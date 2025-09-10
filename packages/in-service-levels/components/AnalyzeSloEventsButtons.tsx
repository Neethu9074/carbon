/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import type { ApplicationSloEntity, ServiceLevelObjectiveConfiguration, WebsiteSloEntity } from '@instana/types';
import { isInfraSloEntity, isSyntheticSloEntity } from '@instana/types';
import { MenuButton, MenuItem } from '@instana/carbon';

import useNavigateToUnboundedAnalytics from 'in-service-levels/navigation/hooks/useNavigateToUnboundedAnalytics';
import { createGoodBadTagFilterExpression } from 'in-service-levels/utils/tagFilter';
import { getLabelByType } from 'in-analyze/AnalyzeView/dataSources';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

interface AnalyzeSloCallsButtonProps {
  configuration: ServiceLevelObjectiveConfiguration;
}

export default function AnalyzeSloEventsButtons({ configuration }: AnalyzeSloCallsButtonProps) {
  const { indicator, entity } = configuration;
  if (isSyntheticSloEntity(entity) || isInfraSloEntity(entity)) return null;

  const { bad: badEventsFilterExpression } = createGoodBadTagFilterExpression({ entity, indicator });

  const timeConfig = useTimeConfig();
  const navigateToAnalyze = useNavigateToUnboundedAnalytics({ indicator, entity, timeConfig, withLabels: true });
  const navigateToAnalyzeWithBadEvents = useNavigateToUnboundedAnalytics({
    indicator,
    entity,
    timeConfig,
    additionalTagFilterExpression: badEventsFilterExpression,
    withLabels: true
  });

  const label = getLabel(entity);
  return (
    <MenuButton menuAlignment="bottom" size="md" label={t('in-service-levels:analyzeSloEventsButton.analyze')}>
      <MenuItem label={label} onClick={navigateToAnalyze} />
      <MenuItem
        label={t('in-service-levels:analyzeSloEventsButton.bad', { label })}
        onClick={navigateToAnalyzeWithBadEvents}
      />
    </MenuButton>
  );
}

function getLabel(entity: WebsiteSloEntity | ApplicationSloEntity) {
  switch (entity.type) {
    case 'application':
      return getLabelByType('calls');
    case 'website':
      return getLabelByType(entity.beaconType);
  }
}
