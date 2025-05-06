/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useEffect, useState } from 'react';

import { LoadingSkeleton, Stack, SvgIcon, Tooltip, Typography } from '@instana/components';
import { Pill } from '@instana/components';
import { t } from '@instana/i18n-react';

import { getProbabilityLevel } from 'in-events/components/RootCauseAnalysis/utils/rootCauseUtil';

import locals from 'in-events/components/legacy/EventList.mless';

interface AIProbabilityBadgeProps {
  probabilityScore: number | null | undefined;
  loading: boolean;
}
const LOW = 'LOW';
const MODERATE = 'MODERATE';
const HIGH = 'HIGH';

export default function AIProbabilityBadge({ probabilityScore, loading }: AIProbabilityBadgeProps) {
  const [probabilityThreshold, setProbabilityThreshold] = useState(HIGH);

  useEffect(() => {
    const probabilityLevel = getProbabilityLevel(probabilityScore);
    setProbabilityThreshold(probabilityLevel);
  }, [probabilityScore]);

  return (
    <div className={locals.confidencePilled}>
      <Stack direction="horizontal" gap="xsmall" align="center">
        <SvgIcon type="lib_datetime_speed" size="xs" />
        <Typography variant="heading-100" noMargin>
          {t('in-events:RCA.probabilityLevelText')}{' '}
        </Typography>
        {!loading && (
          <Tooltip align="leftBottom" content={getTooltipContent(probabilityThreshold)} caret={false}>
            <Pill
              type={
                probabilityThreshold === HIGH
                  ? 'green'
                  : probabilityThreshold === MODERATE
                  ? 'yellow'
                  : probabilityThreshold === LOW
                  ? 'red'
                  : 'gray'
              }
            >
              <Typography variant="body-regular">
                <div className={getBadgeStylingClass(probabilityThreshold)}>{getBadgeText(probabilityThreshold)}</div>
              </Typography>
            </Pill>
          </Tooltip>
        )}
        {loading && <LoadingSkeleton className={locals.loadingEntity} />}
      </Stack>
    </div>
  );
}

function getTooltipContent(probabilityThreshold: string): string {
  if (probabilityThreshold === HIGH) {
    return t('in-events:RCA.highProbabilityBadgeText');
  } else if (probabilityThreshold === MODERATE) {
    return t('in-events:RCA.moderateProbabilityBadgeText');
  } else if (probabilityThreshold === LOW) {
    return t('in-events:RCA.lowProbabilityBadgeText');
  } else {
    return t('in-events:RCA.naProbabilityBadgeText');
  }
}

function getBadgeText(probabilityThreshold: string): string {
  if (probabilityThreshold === HIGH) {
    return t('in-events:RCA.highProbability');
  } else if (probabilityThreshold === MODERATE) {
    return t('in-events:RCA.moderateProbability');
  } else if (probabilityThreshold === LOW) {
    return t('in-events:RCA.lowProbability');
  } else {
    return t('in-events:RCA.naProbability');
  }
}

function getBadgeStylingClass(probabilityThreshold: string): string {
  if (probabilityThreshold === HIGH) {
    return locals.highProbabilityText;
  } else if (probabilityThreshold === MODERATE) {
    return locals.moderateProbabilityText;
  } else if (probabilityThreshold === LOW) {
    return locals.lowProbabilityText;
  } else {
    return locals.naProbabilityText;
  }
}
