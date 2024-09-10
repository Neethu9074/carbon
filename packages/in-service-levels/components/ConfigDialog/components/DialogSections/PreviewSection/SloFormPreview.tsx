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
import { t } from 'in-i18n';

export default function SloFormPreview() {
  const { form, setForm } = useContext(SloFormContext);

  const isFormValid = form.hierarchyValid;
  const isNameFieldValid = form.getIn(['nameTags', 'name']).valid;
  const formValidationErrors = form.getAllMessagesInHierarchy();
  const isOnlyNameFieldFailingValidation = formValidationErrors.length === 1 && !isNameFieldValid;
  const shouldShowPreview = isFormValid || isOnlyNameFieldFailingValidation;

  return (
    <section>
      <Stack>
        <Typography variant="heading-200" component="h2" noMargin>
          {t('in-service-levels:general.preview')}
        </Typography>
        {shouldShowPreview && (
          <Typography variant="body-regular" component="p" noMargin>
            {t('in-service-levels:createSloDialog.previewSection.dataInfo')}
          </Typography>
        )}
        {shouldShowPreview ? <SloConfigPreview /> : <SloFormMissingDataPreview updateForm={setForm} />}
      </Stack>
    </section>
  );
}
