/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext } from 'react';

import { Typography } from '@instana/components';

import SloEntityEditModeSectionContent from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloEntitySection/SloEntityEditModeSectionContent';
import SloApplicationEntitySection from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloEntitySection/SloApplicationEntitySection';
import SloSynthethicEntitySection from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloEntitySection/SloSynthethicEntitySection';
import SloWebsiteEntitySection from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloEntitySection/SloWebsiteEntitySection';
import SloFormContext from 'in-service-levels/components/ConfigDialog/createSloForm/SloFormContext';
import SloEntityTypeSelector from 'in-service-levels/components/Shared/SloEntityTypeSelector';
import { t } from 'in-i18n';

export default function SloEntitySection() {
  const { form, mode, onChange } = useContext(SloFormContext);

  const sloSloEntityTypeField = form.getIn(['entity', 'type']);

  if (mode === 'EDIT') return <SloEntityEditModeSectionContent />;

  return (
    <>
      <Typography variant="heading-200" component="h2">
        {t('in-service-levels:createSloDialog.selectEntityTitle')}
      </Typography>
      <SloEntityTypeSelector
        onChange={type => {
          onChange(['entity', 'type'], () => sloSloEntityTypeField.setValue(type).setTouched(true));
        }}
        value={sloSloEntityTypeField.value}
      />
      {sloSloEntityTypeField.value === 'application' && <SloApplicationEntitySection />}
      {sloSloEntityTypeField.value === 'website' && <SloWebsiteEntitySection />}
      {sloSloEntityTypeField.value === 'synthetic' && <SloSynthethicEntitySection />}
    </>
  );
}
