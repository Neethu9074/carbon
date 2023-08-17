/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext } from 'react';

import { Stack, Typography } from '@instana/components';

import SloFormContext from 'in-service-levels/components/ConfigDialog/createSloForm/SloFormContext';
import { t } from 'in-i18n';

export default function HeadlineFormSection() {
  const { form } = useContext(SloFormContext);

  const blueprintField = form.getIn(['indicator', 'blueprint']);

  return (
    <Stack gap="xsmall">
      <Typography variant="heading-200" component="h2" noMargin>
        {t('in-service-levels:general.indicator.blueprint', { context: blueprintField.value })}
      </Typography>
      <Typography variant="body-regular" component="p" noMargin>
        {t('in-service-levels:createSloDialog.indicatorSection.description', { context: blueprintField.value })}
      </Typography>
    </Stack>
  );
}
