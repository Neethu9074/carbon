/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext } from 'react';

import { Stack, Typography, Button } from '@instana/components';

import SloFormContext from 'in-service-levels/components/ConfigDialog/createSloForm/SloFormContext';
import { SloFormSideEffectsReturnType } from 'in-service-levels/hooks/useSloFormSideEffects';
import { t } from 'in-i18n';

interface SloFormMissingDataPreviewProps {
  updateForm: SloFormSideEffectsReturnType;
}

export default function SloFormMissingDataPreview({ updateForm }: SloFormMissingDataPreviewProps) {
  const { form } = useContext(SloFormContext);

  return (
    <Stack align="center">
      <Typography variant="body-regular">
        {t('in-service-levels:sloChart.missingData.previewNotAvailWidgetConfigIncomplete')}
      </Typography>
      <Button kind="action" onClick={() => updateForm(form.setTouched(true, { recurse: true }))} size="compact">
        {t('in-service-levels:sloChart.missingData.highlightMissingConfig')}
      </Button>
    </Stack>
  );
}
