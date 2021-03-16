/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import SectionHeading from 'in-settings/components/SectionHeading';
import DescriptionText from 'in-components/form/DescriptionText';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-settings/components/FormGroup';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';
import { t } from 'in-i18n';

export default function Step1({ form, onChange }) {
  return form.get('name').map(field => (
    <FormGroup>
      <SectionHeading>{t('in-settings:tabs.1Name')}</SectionHeading>
      <Label htmlFor="name" hasError={!field.valid && field.touched}>
        {t('in-settings:tabs.name')}
      </Label>
      <Input
        id="name"
        type="text"
        value={field.value}
        maxLength={256}
        onChange={e => onChange('name', e.target.value)}
        hasError={!field.valid}
      />
      <TouchedMessages field={field} />
      <DescriptionText>{t('in-settings:tabs.showsUpInTheListOfAlertsShouldBeUniqueAndMeaningful')}</DescriptionText>
    </FormGroup>
  ));
}
