/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext } from 'react';

import { Stack, Typography } from '@instana/components';
import { t } from '@instana/i18n-react';

import EventBasedErrorBudgetPreview from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloObjectiveSection/EventBasedErrorBudgetPreview';
import TimeBasedErrorBudgetPreview from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloObjectiveSection/TimeBasedErrorBudgetPreview';
import { formToEntity, formToTimeWindow } from 'in-service-levels/components/ConfigDialog/createSloForm/utils';
import SloFormContext from 'in-service-levels/components/ConfigDialog/createSloForm/SloFormContext';

export default function EstimatedErrorBudget() {
  const { form } = useContext(SloFormContext);
  const entity = formToEntity(form);

  const indicator = form.getIn(['indicator', 'type']).value;
  const target = form.getIn(['objective', 'target']).value;
  const timeWindow = formToTimeWindow(form);

  const isCustomEventBased = indicator === 'customEventBased';
  const isEventBased = indicator === 'eventBased';
  const isTimeBased = indicator === 'timeBased';

  return (
    <Stack direction="vertical">
      <Typography variant="body-regular">
        {t('in-service-levels:createSloDialog.errorBudgetPreviewTitle', { context: indicator })}
      </Typography>

      {isTimeBased && <TimeBasedErrorBudgetPreview timeWindow={timeWindow} target={target} />}
      {(isEventBased || isCustomEventBased) && (
        <EventBasedErrorBudgetPreview entity={entity} target={target} timeWindow={timeWindow} />
      )}
    </Stack>
  );
}
