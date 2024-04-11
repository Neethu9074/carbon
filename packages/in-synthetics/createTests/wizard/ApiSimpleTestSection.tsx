/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field, Item, MapForm } from 'formalistic';
import React from 'react';

import { Stack } from '@instana/components';
import { t } from '@instana/i18n-react';

import { HTTPMethods } from 'in-synthetics/createTests/form/createSyntheticTestForm';
import { SubTitle } from 'in-synthetics/createTests/wizard/Section';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-components/form/FormGroup';
import ComboBox from 'in-components/ComboBox';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';

import locals from 'in-synthetics/createTests/wizard/RequestResponseStep.mless';

interface ApiSimpleTestSectionProps {
  methodField: Field<string>;
  urlField: Field<string>;
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
}

const ApiSimpleTestSection = ({ methodField, updateForm, form, urlField }: ApiSimpleTestSectionProps) => {
  return (
    <div className={locals.requestContainer}>
      <SubTitle>{t('in-synthetics:dialog.createTest.requestStep.subTitle')}</SubTitle>
      <Stack direction="horizontal">
        <FormGroup>
          <Label htmlFor={'httpMethod'} hasError={!methodField?.valid && methodField?.touched}>
            {t('in-synthetics:dialog.createTest.requestStep.labelOperation')}
          </Label>
          <ComboBox
            name={'httpMethod'}
            value={methodField?.value}
            options={HTTPMethods}
            onChange={e => {
              if (e != null && !(e instanceof Array)) {
                updateForm(
                  form.updateIn(['configuration', 'operation'], (field: Item) =>
                    (field as Field<string>).setValue(e.value).setTouched(true)
                  )
                );
              }
            }}
            defaultValue={HTTPMethods[0].value}
            isClearable={false}
            isOptionDisabled={(option: any) => option.isdisabled}
            isDisabled // Only GET is being supported in the first iteration
          />
          <TouchedMessages field={methodField} />
        </FormGroup>

        {urlField.map(field => (
          <FormGroup className={locals.urlInput}>
            <Label htmlFor="url" hasError={!field.valid && field.touched}>
              {t('in-synthetics:dialog.createTest.requestStep.labelUrl')}
            </Label>
            <Input
              name="url"
              value={field.value}
              onChange={({ target }: React.ChangeEvent<HTMLInputElement>) => {
                updateForm(
                  form.updateIn(['configuration', 'url'], (urlFormField: Item) =>
                    (urlFormField as Field<string>).setValue(target?.value).setTouched(true)
                  )
                );
              }}
              hasError={!field.valid && field.touched}
            />
            <TouchedMessages field={field} />
          </FormGroup>
        ))}
      </Stack>
    </div>
  );
};

export default ApiSimpleTestSection;
