/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field, Item, MapForm } from 'formalistic';
import React from 'react';

import { Stack } from '@instana/components';

import { Validations, HTTPMethods } from 'in-synthetics/form/createSyntheticTestForm';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import CheckboxFancy from 'in-components/form/CheckboxFancy/CheckboxFancy';
import { AdvancedModeProps } from 'in-synthetics/utils/constants';
import ComboBox from 'in-components/ComboBox/ComboBox';
import FormGroup from 'in-components/form/FormGroup';
import Label from 'in-components/form/Label/Label';
import Input from 'in-components/form/Input';
import { t } from 'in-i18n';

import locals from './ConfigurationSection.mless';

export default function ConfigurationSection({ form, updateForm }: AdvancedModeProps) {
  const configForm = form.get('configuration') as MapForm;
  const methodField = configForm.get('operation') as Field<string>;
  const urlField = configForm.get('url') as Field<string>;
  const expectedStatus = configForm.get('expectedStatus') as Field<string>;
  const expectedStatusDescription = configForm.get('expectedStatusDescription') as Field<string>;
  const allowInsecure = configForm.get('allowInsecure') as Field<boolean>;

  return (
    <div>
      <div className={locals.configContainer}>
        <Stack direction="horizontal">
          <FormGroup>
            <Label htmlFor={'httpMethod'} hasError={!methodField?.valid && methodField?.touched}>
              {t('in-synthetics:dialog.createTest.requestStep.labelOperation')}
            </Label>
            <ComboBox
              name={'httpMethod'}
              value={methodField?.value}
              options={HTTPMethods}
              defaultValue={HTTPMethods[0].value}
              isClearable={false}
              isOptionDisabled={(option: any) => option.isdisabled}
              isDisabled
              onChange={e => {
                if (e != null && !(e instanceof Array)) {
                  updateForm(
                    form.updateIn(['configuration', 'operation'], (field: Item) =>
                      (field as Field<string>).setValue(e.value).setTouched(true)
                    )
                  );
                }
              }}
            />
            <TouchedMessages field={methodField} />
          </FormGroup>

          {urlField.map(field => (
            <FormGroup className={locals.descriptionInput}>
              <Label htmlFor="url" hasError={!field.valid && field.touched}>
                {t('in-synthetics:dialog.createTest.requestStep.labelUrl')}
              </Label>
              <Input
                name="url"
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
        </Stack>
      </div>
      <div className={locals.configContainer}>
        <Stack direction="horizontal">
          <FormGroup className={locals.statusBox}>
            <ComboBox
              name={'validation'}
              value={expectedStatus?.value}
              options={Validations}
              defaultValue={Validations[0].value}
              isClearable={false}
              isOptionDisabled={(option: any) => option.isdisabled}
              onChange={e => {
                if (e != null && !(e instanceof Array)) {
                  updateForm(
                    form.updateIn(['configuration', 'expectedStatus'], (field: Item) =>
                      (field as Field<string>).setValue(e.value).setTouched(true)
                    )
                  );
                }
              }}
            />
            <TouchedMessages field={expectedStatus} />
          </FormGroup>
          {expectedStatusDescription.map(field => (
            <FormGroup className={locals.descriptionInput}>
              <Input
                name="expectedStatusDescription"
                placeholder={t('in-synthetics:dialog.createTest.configStep.expectedStatus')}
                value={field.value}
                onChange={({ target }: React.ChangeEvent<HTMLInputElement>) => {
                  updateForm(
                    form.updateIn(['configuration', 'expectedStatusDescription'], (field: Item) =>
                      (field as Field<string>).setValue(target?.value).setTouched(true)
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
      <div className={locals.configContainer}>
        <CheckboxFancy
          onChange={({ target }) => {
            updateForm(
              form.updateIn(['configuration', 'allowInsecure'], (field: Item) =>
                (field as Field<boolean>).setValue(target.checked).setTouched(true)
              )
            );
          }}
          checked={allowInsecure.value}
          size="larger"
          label={t('in-synthetics:dialog.createTest.configStep.allowInsecure')}
          disabled={false}
        />
      </div>
    </div>
  );
}
