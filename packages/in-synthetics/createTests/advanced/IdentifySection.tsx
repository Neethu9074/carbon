/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field, Item, MapForm } from 'formalistic';
import React from 'react';

import { GroupPermissionEntity, Result } from '@instana/types';
import { TextArea } from '@instana/components';

import ApplicationsSection from 'in-synthetics/createTests/wizard/ApplicationsSection';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import { syntheticRbacLimitedEnabled } from 'in-services/featureFlags';
import FormGroup from 'in-components/form/FormGroup/FormGroup';
import Label from 'in-components/form/Label/Label';
import Input from 'in-components/form/Input/Input';
import { t } from 'in-i18n';

import locals from 'in-synthetics/createTests/advanced/IdentifySection.mless';

export interface Props {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  applications: Result<GroupPermissionEntity[]>;
}

export default function IdentifySection({ form, updateForm, applications }: Props) {
  const labelField = form.get('label') as Field<string>;
  const descriptionField = form.get('description') as Field<string>;

  return (
    <div>
      <div className={locals.outerBox}>
        <div>
          {labelField.map(field => (
            <FormGroup className={locals.urlInput}>
              <Label htmlFor="name" hasError={!field.valid && field.touched}>
                {t('in-synthetics:dialog.createTest.basicDetails.labelName')}
              </Label>
              <Input
                name="name"
                value={field.value}
                onChange={({ target }: React.ChangeEvent<HTMLInputElement>) => {
                  updateForm(
                    form.updateIn(['label'], (labelFormField: Item) =>
                      (labelFormField as Field<string>).setValue(target.value).setTouched(true)
                    )
                  );
                }}
                hasError={!field.valid && field.touched}
              />
              <TouchedMessages field={field} />
            </FormGroup>
          ))}
        </div>
      </div>
      <div className={locals.outerBox}>
        {descriptionField.map(field => (
          <FormGroup className={locals.urlInput}>
            <Label htmlFor="description" hasError={!field.valid && field.touched}>
              {t('in-synthetics:dialog.createTest.basicDetails.labelDescription')}
            </Label>
            <TextArea
              name="description"
              value={field.value}
              onChange={({ target }: React.ChangeEvent<HTMLTextAreaElement>) => {
                updateForm(
                  form.updateIn(['description'], (descriptionFormField: Item) =>
                    (descriptionFormField as Field<string>).setValue(target.value).setTouched(true)
                  )
                );
              }}
              hasError={!field.valid && field.touched}
            />
            <TouchedMessages field={field} />
          </FormGroup>
        ))}
      </div>
      {!syntheticRbacLimitedEnabled && (
        <div className={locals.baseContainer}>
          <ApplicationsSection form={form} updateForm={updateForm} applications={applications} />
        </div>
      )}
    </div>
  );
}
