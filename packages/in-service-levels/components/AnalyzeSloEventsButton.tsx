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

import { getIconByType, getLabelByType } from 'in-analyze/AnalyzeView/dataSources';

interface AnalyzeSloCallsButtonProps {
  configuration: ServiceLevelObjectiveConfiguration;
}

export default function AnalyzeSloEventsButton({ configuration }: AnalyzeSloCallsButtonProps) {
  return (
    <Button
      kind="primary"
      icon={getIconType(configuration.entity)}
      disabled // This is disabled for now until the full functionality is implemented
    >
      <Typography variant="body-regular" onDark>
        {t('in-service-levels:analyzeSloEventsButton.analyze', { entity: getLabel(configuration.entity) })}
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
