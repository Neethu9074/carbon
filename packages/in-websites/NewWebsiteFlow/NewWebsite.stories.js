/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createField, notBlankValidator } from 'formalistic';
import React from 'react';

import InputStepComponent from 'in-websites/NewWebsiteFlow/InputStep';
import ReadyStepComponent from 'in-websites/NewWebsiteFlow/ReadyStep';
import WaitStepComponent from 'in-websites/NewWebsiteFlow/WaitStep';

export default {
  component: InputStep
};

export function InputStep(props) {
  let field = createField({
    value: 'shop.example.com',
    validator: notBlankValidator
  });

  if (props.withValidationError) {
    field = field.setValue('').setTouched(true);
  }

  let saveError;
  if (props.withSaveError) {
    saveError = 'Website name is already used.';
  }

  return <InputStepComponent field={field} loading={props.loading} saveError={saveError} />;
}
InputStep.args = { loading: false, withValidationError: false, withSaveError: false };

export function WaitStep() {
  return <WaitStepComponent websiteId="89jkdsa1khj32njk1" websiteName="shop.example.com" />;
}

export function ReadyStep() {
  return <ReadyStepComponent websiteId="89jkdsa1khj32njk1" websiteName="shop.example.com" />;
}
