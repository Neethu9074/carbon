/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import {
  isApplicationSloEntity,
  isSyntheticSloEntity,
  isWebsiteSloEntity,
  ServiceLevelObjectiveConfiguration,
  SloEntity,
  TimeConfig
} from '@instana/types';
import { Button, CarbonMenuItem, SvgIcon } from '@instana/components';
import { t } from '@instana/i18n-react';

import useNavigateToUnboundedAnalytics from 'in-service-levels/navigation/hooks/useNavigateToUnboundedAnalytics';
import { getIconByType, getLabelByType } from 'in-analyze/AnalyzeView/dataSources';

interface AnalyzeSloEventButtonProps {
  sloConfig: ServiceLevelObjectiveConfiguration;
  timeConfig: TimeConfig;
  as?: 'button' | 'menuItem';
}

export default function AnalyzeSloEventButton({ sloConfig, timeConfig, as = 'button' }: AnalyzeSloEventButtonProps) {
  if (isSyntheticSloEntity(sloConfig.entity)) return <></>;

  return <AnalyzeSloAppWebsiteEventButton sloConfig={sloConfig} timeConfig={timeConfig} as={as} />;
}

function AnalyzeSloAppWebsiteEventButton({
  sloConfig: { indicator, entity },
  timeConfig,
  as
}: AnalyzeSloEventButtonProps) {
  const navigateToAnalyze = useNavigateToUnboundedAnalytics({ indicator, entity, timeConfig, withLabels: true });

  if (as === 'menuItem') {
    return (
      <CarbonMenuItem
        label={t('in-service-levels:analyzeSloEventsButton.analyze', { entity: getLabel(entity) })}
        renderIcon={() => {
          const iconType = getIconType(entity);
          if (iconType) {
            return <SvgIcon type={iconType} size="xs" />;
          }
          return null;
        }}
        onClick={navigateToAnalyze}
      />
    );
  }

  return (
    <Button kind="primary" icon={getIconType(entity)} onClick={navigateToAnalyze}>
      {t('in-service-levels:analyzeSloEventsButton.analyze', { entity: getLabel(entity) })}
    </Button>
  );
}

function getIconType(entity: SloEntity): string | undefined {
  if (isApplicationSloEntity(entity)) {
    return getIconByType('calls', 'application');
  } else if (isWebsiteSloEntity(entity)) {
    return getIconByType(entity.beaconType, 'website');
  }
  return undefined;
}

function getLabel(entity: SloEntity): string | undefined {
  if (isApplicationSloEntity(entity)) {
    return getLabelByType('calls');
  } else if (isWebsiteSloEntity(entity)) {
    return getLabelByType(entity.beaconType);
  }
  return undefined;
}
