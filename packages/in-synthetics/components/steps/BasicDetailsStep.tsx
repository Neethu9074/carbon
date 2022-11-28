/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { Field, MapForm, Item } from 'formalistic';
import React from 'react';

import { BluePrint } from 'in-synthetics/data/simpleModeBluePrints';
import TouchedMessages from 'in-components/form/TouchedMessages';
import Section from 'in-synthetics/components/Section';
import FormGroup from 'in-components/form/FormGroup';
import TextArea from 'in-components/form/TextArea';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import { t } from 'in-i18n';

import locals from './BasicDetailsStep.mless';

export interface Props {
  form: MapForm;
  updateForm: (form: MapForm) => void;
  selectedBlueprint: BluePrint;
}

export default function BasicDetailsStep({ form, updateForm, selectedBlueprint }: Props) {
  const labelField = form.get('label') as Field<string>;
  const descriptionField = form.get('description') as Field<string>;
  const headingText =
    selectedBlueprint?.type === 'Script API'
      ? t('in-synthetics:dialog.createTest.basicDetails.scriptTitle')
      : t('in-synthetics:dialog.createTest.basicDetails.title');
  return (
    <Section headingText={headingText}>
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
                form.updateIn(['label'], (field: Item) =>
                  (field as Field<string>).setValue(target.value).setTouched(true)
                )
              );
            }}
            hasError={!field.valid && field.touched}
          />
          <TouchedMessages field={field} />
        </FormGroup>
      ))}
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
                form.updateIn(['description'], (field: Item) =>
                  (field as Field<string>).setValue(target.value).setTouched(true)
                )
              );
            }}
            hasError={!field.valid && field.touched}
          />
          <TouchedMessages field={field} />
        </FormGroup>
      ))}
    </Section>
  );
}
