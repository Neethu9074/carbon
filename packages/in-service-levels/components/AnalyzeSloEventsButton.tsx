/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import {
  isApplicationSloEntity,
  isWebsiteSloEntity,
  ServiceLevelObjectiveConfiguration,
  SloEntity
} from '@instana/types';
import { Button, Typography } from '@instana/components';
import { t } from '@instana/i18n-react';

import useHrefToUnboundedAnalytics from 'in-service-levels/navigation/hooks/useHrefToUnboundedAnalytics';
import { getIconByType, getLabelByType } from 'in-analyze/AnalyzeView/dataSources';
import useTimeConfig from 'in-hooks/useTimeConfig';

interface AnalyzeSloCallsButtonProps {
  configuration: ServiceLevelObjectiveConfiguration;
}

export default function AnalyzeSloEventsButton({ configuration: { indicator, entity } }: AnalyzeSloCallsButtonProps) {
  const timeConfig = useTimeConfig();
  const linkToAnalyze = useHrefToUnboundedAnalytics({ indicator, entity, timeConfig, withLabels: true });

  return (
    <Button kind="primary" icon={getIconType(entity)} href={linkToAnalyze}>
      <Typography variant="body-regular" onDark>
        {t('in-service-levels:analyzeSloEventsButton.analyze', { entity: getLabel(entity) })}
      </Typography>
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
