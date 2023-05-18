/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Item, Field } from 'formalistic';
import React from 'react';

import { SloEntityType } from '@instana/types';

import { CommonSloForm, SloForm, sloEntityTypeKey } from 'in-service-levels/components/ConfigDialog/form';
import SloEntityTypeSelector from 'in-service-levels/components/SloList/components/SloEntityTypeSelector';
import { t } from 'in-i18n';
import { Typography } from '@instana/components';
import { SloSelectionSection } from 'in-service-levels/components/ConfigDialog/DialogSections/SloEntitySection/SloSelectionSection';

interface SloScopeSectionProps {
  form: SloForm<SloEntityType>;
  onChange: (path: string[], updater: (i: Item) => Item) => void;
}

export const SloEntitySection = ({ form, onChange }: SloScopeSectionProps) => {
  // const updateForm = useSloFormSideEffects(form, setForm as (f: Item) => void);
  const sloSloEntityTypeField = (form as unknown as CommonSloForm).get(sloEntityTypeKey);
  console.log('sloSloEntityTypeField', sloSloEntityTypeField);
  console.log('sloSloEntityTypeField.value', sloSloEntityTypeField.value);
  const selectedLabel = sloSloEntityTypeField ? sloSloEntityTypeField : t('in-service-levels:general.noSelection');
  return (
    <>
      <Typography variant="heading-200" component="h2">
        {t('in-service-levels:createSloDialog.selectEntityTitle')}
      </Typography>
      {/* <EntityTypeSelector
        value={sloSloEntityTypeField.value}
        onChange={type =>
          onChange([sloEntityTypeKey], field => (field as Field<SloEntityType>).setValue(type).setTouched(true))
        }
      /> */}
      <SloEntityTypeSelector
        value={sloSloEntityTypeField.value}
        onChange={type =>
          onChange([sloEntityTypeKey], field => (field as Field<SloEntityType>).setValue(type).setTouched(true))
        }
      />
      <Typography variant="heading-100" component="h3">
        {t('in-service-levels:general.selectLabel', { selectedLabel })}
      </Typography>

      <SloSelectionSection form={form} onChange={(_path, _fn) => updateForm(() => {})} />
    </>
  );
};
function updateForm(arg0: any): void {
  throw new Error('Function not implemented.');
}
