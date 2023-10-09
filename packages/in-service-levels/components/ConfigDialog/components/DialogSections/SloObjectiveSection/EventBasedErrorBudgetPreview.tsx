/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { daysInWeek } from 'date-fns';
import React from 'react';

import { LoadingSkeleton, Stack, Typography } from '@instana/components';
import { TimeWindow } from '@instana/types';

import useEstimatedEventBasedErrorBudget from 'in-service-levels/hooks/useEstimatedEventBasedErrorBudget';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

import locals from './SloObjectiveSection.mless';

type EventBasedErrorBudgetPreviewProps = Parameters<typeof useEstimatedEventBasedErrorBudget>[0];

export default function EventBasedErrorBudgetPreview({
  entity,
  target,
  timeWindow
}: EventBasedErrorBudgetPreviewProps) {
  const [budget, status] = useEstimatedEventBasedErrorBudget({ entity, target, timeWindow });
  const formatted = budget !== undefined ? number.compact(budget) : valueMissingPlaceholder;

  return (
    <Stack gap="medium">
      {status === 'pending' ? (
        <LoadingSkeleton className={locals.estimatedBudgetSkeleton} />
      ) : (
        <Typography variant="body-bold">
          {t('in-service-levels:general.format.event', {
            context: entity.type,
            count: budget,
            formatted
          })}
        </Typography>
      )}
      <ErrorBudgetDisclaimer timeWindow={timeWindow} />
    </Stack>
  );
}

interface ErrorBudgetDisclaimerProps {
  timeWindow: TimeWindow;
}

const maxDays = 7;
function ErrorBudgetDisclaimer({ timeWindow }: ErrorBudgetDisclaimerProps) {
  const { duration, durationUnit } = timeWindow;

  const timeWindowDays = durationUnit === 'week' ? duration * daysInWeek : duration;
  const days = Math.min(timeWindowDays, maxDays);

  return (
    <Typography variant="body-regular">
      {t('in-service-levels:createSloDialog.estErrorBudgetMsg', { count: days })}
    </Typography>
  );
}
