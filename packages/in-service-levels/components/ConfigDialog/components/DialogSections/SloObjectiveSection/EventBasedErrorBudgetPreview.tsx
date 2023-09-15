/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { ApplicationSloEntity, WebsiteSloEntity, isApplicationSloEntity } from '@instana/types';
import { Stack, Typography } from '@instana/components';

import useEstimatedEventBasedErrorBudget from 'in-service-levels/hooks/useEstimatedEventBasedErrorBudget';
import { t } from 'in-i18n';

interface EventBasedErrorBudgetPreviewProps {
  entity: ApplicationSloEntity & WebsiteSloEntity;
  target?: number;
}

export default function EventBasedErrorBudgetPreview({ entity, target }: EventBasedErrorBudgetPreviewProps) {
  const budget = useEstimatedEventBasedErrorBudget(entity, target);

  const entityType = (entity as ApplicationSloEntity | WebsiteSloEntity).type;
  const isApplication = isApplicationSloEntity(entity);

  return (
    <Stack gap="medium">
      <Typography variant="body-bold">
        {t('in-service-levels:general.format.event', { context: entityType, formatted: budget })}
      </Typography>
      {isApplication && t('in-service-levels:createSloDialog.estErrorBudgetMsg')}
    </Stack>
  );
}
