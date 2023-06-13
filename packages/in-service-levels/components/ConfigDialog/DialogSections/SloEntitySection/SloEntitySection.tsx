/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field, Item } from 'formalistic';
import React, { useState } from 'react';

import { Typography } from '@instana/components';
import { SloEntityType } from '@instana/types';

import { SloApplicationEntitySection } from 'in-service-levels/components/ConfigDialog/DialogSections/SloEntitySection/SloApplicationEntitySection';
import { SloWebsiteEntitySection } from 'in-service-levels/components/ConfigDialog/DialogSections/SloEntitySection/SloWebsiteEntitySection';
import { SloForm, isApplicationSloForm, sloEntityTypeKey } from 'in-service-levels/components/ConfigDialog/form';
import SloEntityTypeSelector from 'in-service-levels/components/SloList/components/SloEntityTypeSelector';
import { t } from 'in-i18n';

interface SloScopeSectionProps {
  form: SloForm<SloEntityType>;
  onChange: (path: string[], updater: (i: Item) => Item) => void;
}

export const SloEntitySection = ({ form, onChange }: SloScopeSectionProps) => {
  const sloSloEntityTypeField = form.get(sloEntityTypeKey).value;
  const [label, setLabel] = useState('');
  const setLabels = (labels: string) => {
    setLabel(labels);
  };
  const getLabel = (label: string) => {
    return (
      <Typography variant="heading-100" component="h3">
        {t('in-service-levels:general.selectLabel')}
        {label ? label : t('in-service-levels:general.noSelection')}
      </Typography>
    );
  };
  return (
    <>
      <Typography variant="heading-200" component="h2">
        {t('in-service-levels:createSloDialog.selectEntityTitle')}
      </Typography>
      <SloEntityTypeSelector
        value={sloSloEntityTypeField}
        onChange={type => {
          setLabel(t('in-service-levels:general.noSelection'));
          onChange([sloEntityTypeKey], field => (field as Field<SloEntityType>).setValue(type).setTouched(true));
        }}
      />
      {getLabel(label)}
      {isApplicationSloForm(form) ? (
        <SloApplicationEntitySection form={form} onChange={onChange} onLabelChange={setLabels} />
      ) : (
        <SloWebsiteEntitySection form={form} onChange={onChange} onLabelChange={setLabels} />
      )}
    </>
  );
};
