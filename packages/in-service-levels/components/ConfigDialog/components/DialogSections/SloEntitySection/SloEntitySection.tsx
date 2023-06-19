/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';
import { Item } from 'formalistic';

import { Typography } from '@instana/components';
import { SloEntityType } from '@instana/types';

import { SloApplicationEntitySection } from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloEntitySection/SloApplicationEntitySection';
import { SloWebsiteEntitySection } from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloEntitySection/SloWebsiteEntitySection';
import { SloForm, isApplicationSloForm, SloFormPath } from 'in-service-levels/components/ConfigDialog/createSloForm';
import SloEntityTypeSelector from 'in-service-levels/components/SloList/components/SloEntityTypeSelector';
import SloLabel from 'in-service-levels/components/SloList/components/SloLabel';
import { t } from 'in-i18n';

interface SloScopeSectionProps {
  form: SloForm<SloEntityType>;
  onChange: (path: SloFormPath<SloEntityType>, updater: (i: Item) => Item) => void;
}

export const SloEntitySection = ({ form, onChange }: SloScopeSectionProps) => {
  const sloSloEntityTypeField = form.get('entityType');

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
          onChange(['entityType'], () => sloSloEntityTypeField.setValue(type).setTouched(true));
        }}
      />
      <SloLabel label={label} />
      {isApplicationSloForm(form) ? (
        <SloApplicationEntitySection form={form} onChange={onChange} onLabelChange={setLabel} />
      ) : (
        <SloWebsiteEntitySection form={form} onChange={onChange} onLabelChange={setLabel} />
      )}
    </>
  );
};
