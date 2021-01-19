/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { createField, notBlankValidator } from 'formalistic';
import { withKnobs, boolean } from '@storybook/addon-knobs/react';
import React from 'react';

import InputStepComponent from 'in-websites/NewWebsiteFlow/InputStep';
import ReadyStepComponent from 'in-websites/NewWebsiteFlow/ReadyStep';
import WaitStepComponent from 'in-websites/NewWebsiteFlow/WaitStep';

export default {
  title: 'Templates|website/NewWebsite',
  decorators: [withKnobs]
};

export function InputStep() {
  let field = createField({
    value: 'shop.example.com',
    validator: notBlankValidator
  });

  if (boolean('With Validation Error?', false)) {
    field = field.setValue('').setTouched(true);
  }

  let saveError;
  if (boolean('With Save Error?', false)) {
    saveError = 'Website name is already used.';
  }

  return <InputStepComponent field={field} loading={boolean('Loading?', false)} saveError={saveError} />;
}

export function WaitStep() {
  return <WaitStepComponent websiteId="89jkdsa1khj32njk1" websiteName="shop.example.com" />;
}

export function ReadyStep() {
  return <ReadyStepComponent websiteId="89jkdsa1khj32njk1" websiteName="shop.example.com" />;
}
