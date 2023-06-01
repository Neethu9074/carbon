/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field, Item } from 'formalistic';
import React from 'react';

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

  return (
    <>
      <Typography variant="heading-200" component="h2">
        {t('in-service-levels:createSloDialog.selectEntityTitle')}
      </Typography>
      <SloEntityTypeSelector
        value={sloSloEntityTypeField}
        onChange={type =>
          onChange([sloEntityTypeKey], field => (field as Field<SloEntityType>).setValue(type).setTouched(true))
        }
      />

      {isApplicationSloForm(form) ? (
        <SloApplicationEntitySection form={form} onChange={onChange} />
      ) : (
        <SloWebsiteEntitySection form={form} onChange={onChange} />
      )}
    </>
  );
};
