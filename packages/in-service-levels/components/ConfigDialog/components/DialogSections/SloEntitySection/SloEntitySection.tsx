/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import { Typography } from '@instana/components';

import { SloApplicationEntitySection } from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloEntitySection/SloApplicationEntitySection';
import { SloWebsiteEntitySection } from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloEntitySection/SloWebsiteEntitySection';
import SloEntityTypeSelector from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloEntitySection/SloEntityTypeSelector';
import SloLabel from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloEntitySection/SloLabel';
import { SloForm, SloFormOnChange } from 'in-service-levels/components/ConfigDialog/createSloForm';
import { t } from 'in-i18n';

interface SloScopeSectionProps {
  form: SloForm;
  onChange: SloFormOnChange;
}

export const SloEntitySection = ({ form, onChange }: SloScopeSectionProps) => {
  const sloSloEntityTypeField = form.getIn(['entity', 'type']);

  const [label, setLabel] = useState<string>();

  return (
    <>
      <Typography variant="heading-200" component="h2">
        {t('in-service-levels:createSloDialog.selectEntityTitle')}
      </Typography>
      <SloEntityTypeSelector
        value={sloSloEntityTypeField.value}
        onChange={type => {
          setLabel(t('in-service-levels:general.noSelection'));
          onChange(['entity', 'type'], () => sloSloEntityTypeField.setValue(type).setTouched(true));
        }}
      />
      <SloLabel label={label} />
      {sloSloEntityTypeField.value === 'application' && (
        <SloApplicationEntitySection form={form} onChange={onChange} onLabelChange={setLabel} />
      )}
      {sloSloEntityTypeField.value === 'website' && (
        <SloWebsiteEntitySection form={form} onChange={onChange} onLabelChange={setLabel} />
      )}
    </>
  );
};
