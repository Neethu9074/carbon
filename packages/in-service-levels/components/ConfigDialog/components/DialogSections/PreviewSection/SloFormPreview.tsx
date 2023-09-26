/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext } from 'react';

import { Stack, Typography } from '@instana/components';

import SloFormMissingDataPreview from 'in-service-levels/components/ConfigDialog/components/DialogSections/PreviewSection/SloFormMissingDataPreview';
import SloConfigPreview from 'in-service-levels/components/ConfigDialog/components/DialogSections/PreviewSection/SloConfigPreview';
import SloFormContext from 'in-service-levels/components/ConfigDialog/createSloForm/SloFormContext';
import { SloFormSideEffectsReturnType } from 'in-service-levels/hooks/useSloFormSideEffects';
import { t } from 'in-i18n';

interface SloFormPreviewProps {
  updateForm: SloFormSideEffectsReturnType;
}

export default function SloFormPreview({ updateForm }: SloFormPreviewProps) {
  const { form } = useContext(SloFormContext);

  const shouldShowPreview = form.hierarchyValid;

  return (
    <section>
      <Stack>
        <Typography variant="heading-200" component="h2" noMargin>
          {t('in-service-levels:general.preview')}
        </Typography>
        {shouldShowPreview && (
          <Typography variant="body-regular" component="p" noMargin>
            {t('in-custom-dashboards:widgets.slo.widgetLeftHeader.previewDataInfo')}
          </Typography>
        )}
        {shouldShowPreview ? <SloConfigPreview /> : <SloFormMissingDataPreview updateForm={updateForm} />}
      </Stack>
    </section>
  );
}
