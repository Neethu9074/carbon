/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext } from 'react';

import { Stack, Typography } from '@instana/components';

import SloFormMissingDataPreview from 'in-service-levels/components/ConfigDialog/components/DialogSections/PreviewSection/SloFormMissingDataPreview';
import SloConfigPreview from 'in-service-levels/components/ConfigDialog/components/DialogSections/PreviewSection/SloConfigPreview';
import SloConfigSample from 'in-service-levels/components/ConfigDialog/components/DialogSections/PreviewSection/SloConfigSample';
import SloFormContext from 'in-service-levels/components/ConfigDialog/createSloForm/SloFormContext';
import { t } from 'in-i18n';

export default function SloFormPreview() {
  const { form, setForm } = useContext(SloFormContext);

  const isFormValid = form.hierarchyValid;
  const isNameFieldValid = form.getIn(['nameTags', 'name']).valid;
  const entityType = form.getIn(['entity', 'type']).value;
  const isSyntheticEntity = entityType === 'synthetic';
  const formValidationErrors = form.getAllMessagesInHierarchy();
  const isOnlyNameFieldFailingValidation = formValidationErrors.length === 1 && !isNameFieldValid;
  const showPreview = isFormValid || isOnlyNameFieldFailingValidation;
  const showDataInfo = showPreview && !isSyntheticEntity;

  return (
    <section>
      <Stack>
        <Typography variant="heading-200" component="h2" noMargin>
          {t('in-service-levels:createSloDialog.previewSection.title', { context: entityType })}
        </Typography>
        {showDataInfo && (
          <Typography variant="body-regular" component="p" noMargin>
            {t('in-service-levels:createSloDialog.previewSection.dataInfo')}
          </Typography>
        )}
        {showPreview ? (
          <InternalSloPreview isSyntheticEntity={isSyntheticEntity} />
        ) : (
          <SloFormMissingDataPreview updateForm={setForm} />
        )}
      </Stack>
    </section>
  );
}

interface InternalSloPreviewProps {
  isSyntheticEntity?: boolean;
}

function InternalSloPreview({ isSyntheticEntity }: InternalSloPreviewProps) {
  if (isSyntheticEntity) return <SloConfigSample />;

  return <SloConfigPreview />;
}
