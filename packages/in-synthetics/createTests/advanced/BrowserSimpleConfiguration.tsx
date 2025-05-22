/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field, Item, MapForm } from 'formalistic';
import React from 'react';

import ConfigurationCommonSection from 'in-synthetics/createTests/advanced/ConfigurationCommonSection';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import { Invalid } from 'in-synthetics/utils/constants';
import FormGroup from 'in-components/form/FormGroup';
import Label from 'in-components/form/Label/Label';
import Input from 'in-components/form/Input';
import { t } from 'in-i18n';

import locals from 'in-synthetics/createTests/advanced/ConfigurationSection.mless';

interface Props {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  invalidTimeout: Invalid;
  setInvalidTimeout: React.Dispatch<React.SetStateAction<Invalid>>;
}

export default function BrowserSimpleConfiguration({ form, updateForm, invalidTimeout, setInvalidTimeout }: Props) {
  const configForm = form.get('configuration') as MapForm<any>;
  const webpageUrlField = configForm.get('url') as Field<string>;

  return (
    <div>
      <div className={locals.configContainer}>
        <FormGroup className={locals.descriptionInput}>
          <Label htmlFor="webpageUrl">{t('in-synthetics:dialog.createTest.advancedMode.configStep.webpageUrl')}</Label>
          <Input
            name="webpageUrl"
            value={webpageUrlField.value}
            onChange={({ target }: React.ChangeEvent<HTMLInputElement>) => {
              updateForm(
                form.updateIn(['configuration', 'url'], (field: Item) =>
                  (field as Field<string>).setValue(target?.value).setTouched(true)
                )
              );
            }}
            hasError={!webpageUrlField.valid && webpageUrlField.touched}
          />
          <TouchedMessages field={webpageUrlField} />
        </FormGroup>
      </div>
      <ConfigurationCommonSection
        form={form}
        updateForm={updateForm}
        invalidTimeout={invalidTimeout}
        setInvalidTimeout={setInvalidTimeout}
      />
    </div>
  );
}
