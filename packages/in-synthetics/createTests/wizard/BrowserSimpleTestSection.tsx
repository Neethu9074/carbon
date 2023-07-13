/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field, Item, MapForm } from 'formalistic';
import React from 'react';

import { t } from '@instana/i18n-react';

import { SubTitle } from 'in-synthetics/createTests/wizard/Section';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-components/form/FormGroup';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';

import locals from 'in-synthetics/createTests/wizard/RequestResponseStep.mless';

interface BrowserSimpleTestSectionProps {
  urlField: Field<string>;
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
}

const BrowserSimpleTestSection = ({ urlField, updateForm, form }: BrowserSimpleTestSectionProps) => {
  return (
    <div className={locals.requestContainer}>
      <SubTitle>{t('in-synthetics:dialog.createTest.requestStep.subTitle')}</SubTitle>
      {urlField.map(field => (
        <FormGroup className={locals.urlInput}>
          <Label htmlFor="webpageUrl" hasError={!field.valid && field.touched}>
            {t('in-synthetics:dialog.createTest.advancedMode.configStep.webpageUrl')}
          </Label>
          <Input
            name="webpageUrl"
            value={field.value}
            onChange={({ target }: React.ChangeEvent<HTMLInputElement>) => {
              updateForm(
                form.updateIn(['configuration', 'url'], (field: Item) =>
                  (field as Field<string>).setValue(target?.value).setTouched(true)
                )
              );
            }}
            hasError={!field.valid && field.touched}
          />
          <TouchedMessages field={field} />
        </FormGroup>
      ))}
    </div>
  );
};

export default BrowserSimpleTestSection;
