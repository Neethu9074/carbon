/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import {
  isApplicationSloEntity,
  isWebsiteSloEntity,
  ServiceLevelObjectiveConfiguration,
  SloEntity,
  TimeConfig
} from '@instana/types';
import { Button } from '@instana/legacy';
import { t } from '@instana/i18n-react';

import useHrefToUnboundedAnalytics from 'in-service-levels/navigation/hooks/useHrefToUnboundedAnalytics';
import { getIconByType, getLabelByType } from 'in-analyze/AnalyzeView/dataSources';

interface AnalyzeSloEventButtonProps {
  sloConfig: ServiceLevelObjectiveConfiguration;
  timeConfig: TimeConfig;
}

export default function AnalyzeSloEventButton({
  sloConfig: { indicator, entity },
  timeConfig
}: AnalyzeSloEventButtonProps) {
  const linkToAnalyze = useHrefToUnboundedAnalytics({ indicator, entity, timeConfig, withLabels: true });

  return (
    <Button kind="primary" icon={getIconType(entity)} href={linkToAnalyze}>
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
