/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext } from 'react';

import { ApplicationSloEntity, WebsiteSloEntity } from '@instana/types';
import { Stack, Typography } from '@instana/components';
import { t } from '@instana/i18n-react';

import EventBasedErrorBudgetPreview from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloObjectiveSection/EventBasedErrorBudgetPreview';
import TimeBasedErrorBudgetPreview from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloObjectiveSection/TimeBasedErrorBudgetPreview';
import SloFormContext from 'in-service-levels/components/ConfigDialog/createSloForm/SloFormContext';
import { formToEntity } from 'in-service-levels/components/ConfigDialog/createSloForm/utils';

export default function EstimatedErrorBudget() {
  const { form } = useContext(SloFormContext);
  const entity = formToEntity(form);

  const indicator = form.getIn(['indicator', 'type']).value;
  const target = form.getIn(['objective', 'target']).value;

  const isEventBased = indicator === 'eventBased';
  const isTimeBased = indicator === 'timeBased';

  const timeWindow = {
    duration: form.getIn(['objective', 'duration']).value,
    durationUnit: form.getIn(['objective', 'durationUnit']).value,
    type: form.getIn(['objective', 'type']).value
  };

  return (
    <Stack direction="vertical">
      <Typography variant="body-regular">{t('in-service-levels:createSloDialog.estErrorBudget')}</Typography>

      {isTimeBased && <TimeBasedErrorBudgetPreview timeWindow={timeWindow} target={target} />}
      {isEventBased && (
        <EventBasedErrorBudgetPreview entity={entity as ApplicationSloEntity & WebsiteSloEntity} target={target} />
      )}
    </Stack>
  );
}
