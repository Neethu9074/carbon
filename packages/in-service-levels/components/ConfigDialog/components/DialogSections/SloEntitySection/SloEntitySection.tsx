/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext } from 'react';

import { Typography } from '@instana/components';

import SloApplicationEntitySection from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloEntitySection/SloApplicationEntitySection';
import SloWebsiteEntitySection from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloEntitySection/SloWebsiteEntitySection';
import SloEntityTypeSelector from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloEntitySection/SloEntityTypeSelector';
import SloFormContext from 'in-service-levels/components/ConfigDialog/createSloForm/SloFormContext';
import { t } from 'in-i18n';

export default function SloEntitySection() {
  const { form, onChange } = useContext(SloFormContext);

  const sloSloEntityTypeField = form.getIn(['entity', 'type']);

  return (
    <>
      <Typography variant="heading-200" component="h2">
        {t('in-service-levels:createSloDialog.selectEntityTitle')}
      </Typography>
      <SloEntityTypeSelector
        value={sloSloEntityTypeField.value}
        onChange={type => {
          onChange(['entity', 'type'], () => sloSloEntityTypeField.setValue(type).setTouched(true));
        }}
      />
      {sloSloEntityTypeField.value === 'application' && <SloApplicationEntitySection />}
      {sloSloEntityTypeField.value === 'website' && <SloWebsiteEntitySection />}
    </>
  );
}
