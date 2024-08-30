/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { Field, MapForm, Item } from 'formalistic';
import React from 'react';

import { GroupPermissionEntity, Result } from '@instana/types';
import { TextArea } from '@instana/components';

// eslint-disable-next-line no-restricted-imports
import { apiScriptTest, apiSimpleTest, browserScriptTest, browserSimpleTest } from 'in-synthetics/utils/constants';
import ApplicationsSection from 'in-synthetics/createTests/wizard/ApplicationsSection';
import { BluePrint } from 'in-synthetics/createTests/data/simpleModeBluePrints';
import { syntheticRbacLimitedEnabled } from 'in-services/featureFlags';
import TouchedMessages from 'in-components/form/TouchedMessages';
import Section from 'in-synthetics/createTests/wizard/Section';
import FormGroup from 'in-components/form/FormGroup';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import { t } from 'in-i18n';

import locals from 'in-synthetics/createTests/wizard/BasicDetailsStep.mless';

export interface Props {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  selectedBlueprint: BluePrint;
  applications: Result<GroupPermissionEntity[]>;
}

export default function BasicDetailsStep({ form, updateForm, selectedBlueprint, applications }: Props) {
  const labelField = form.get('label') as Field<string>;
  const descriptionField = form.get('description') as Field<string>;

  const renderHeadingText = (type: string) => {
    switch (type) {
      case apiSimpleTest:
        return t('in-synthetics:dialog.createTest.basicDetails.title');
      case apiScriptTest:
        return t('in-synthetics:dialog.createTest.basicDetails.scriptTitle');
      case browserSimpleTest:
        return t('in-synthetics:dialog.createTest.basicDetails.webpageActionTitle');
      case browserScriptTest:
        return t('in-synthetics:dialog.createTest.basicDetails.browserScriptTitle');
      default:
        return '';
    }
  };

  return (
    <Section headingText={renderHeadingText(selectedBlueprint?.type)}>
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
      {!syntheticRbacLimitedEnabled && (
        <ApplicationsSection form={form} updateForm={updateForm} applications={applications} />
      )}
    </Section>
  );
}
