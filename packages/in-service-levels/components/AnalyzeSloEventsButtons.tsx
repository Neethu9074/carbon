/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import {
  isApplicationSloEntity,
  isSyntheticSloEntity,
  isWebsiteSloEntity,
  ServiceLevelObjectiveConfiguration,
  SloEntity
} from '@instana/types';
import { Typography, Button } from '@instana/components';

import useHrefToUnboundedAnalytics from 'in-service-levels/navigation/hooks/useHrefToUnboundedAnalytics';
import { createGoodBadTagFilterExpression } from 'in-service-levels/utils/tagFilter';
import { getIconByType, getLabelByType } from 'in-analyze/AnalyzeView/dataSources';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

interface AnalyzeSloCallsButtonProps {
  configuration: ServiceLevelObjectiveConfiguration;
}

export default function AnalyzeSloEventsButtons({ configuration }: AnalyzeSloCallsButtonProps) {
  if (isSyntheticSloEntity(configuration.entity)) return <></>;

  return <AnalyzeSloAppWebsiteEventsButtons configuration={configuration} />;
}

function AnalyzeSloAppWebsiteEventsButtons({ configuration: { indicator, entity } }: AnalyzeSloCallsButtonProps) {
  const { bad: badEventsFilterExpression } = createGoodBadTagFilterExpression({ entity, indicator });

  const timeConfig = useTimeConfig();
  const linkToAnalyze = useHrefToUnboundedAnalytics({ indicator, entity, timeConfig, withLabels: true });
  const linkToAnalyzeWithBadEvents = useHrefToUnboundedAnalytics({
    indicator,
    entity,
    timeConfig,
    additionalTagFilterExpression: badEventsFilterExpression,
    withLabels: true
  });

  return (
    <>
      <Button kind="primary" icon={getIconType(entity)} href={linkToAnalyze}>
        <Typography variant="body-regular" onDark>
          {t('in-service-levels:analyzeSloEventsButton.analyze', { entity: getLabel(entity) })}
        </Typography>
      </Button>
      <Button kind="info" icon={getIconType(entity)} href={linkToAnalyzeWithBadEvents}>
        <Typography variant="body-regular" onDark>
          {t('in-service-levels:analyzeSloEventsButton.analyzeBadCalls', { entity: getLabel(entity) })}
        </Typography>
      </Button>
    </>
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
