/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import Paragraph from 'in-mobile-apps/NewMobileAppFlow/Paragraph';
import ValidationBlock from 'in-components/form/ValidationBlock';
import Frame from 'in-mobile-apps/NewMobileAppFlow/Frame';
import SaveError from 'in-components/form/SaveError';
import FormGroup from 'in-components/form/FormGroup';
import Button from 'in-new-components/Button';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';

import locals from './InputStep.mless';

export default function InputStep({ onSubmit, saveError, field, onChange, loading }) {
  return (
    <Frame title="Add Mobile App">
      <Paragraph>
        Get started with mobile app monitoring to better understand how your mobile app performance impacts user
        experience. Configuration is simple!
      </Paragraph>

      <form onSubmit={onSubmit}>
        <FormGroup className={locals.group}>
          <Label htmlFor="mobile-app-name">Mobile App Name</Label>

          {saveError && <SaveError>{saveError}</SaveError>}

          <div className={locals.actionWrapper}>
            <Input
              id="mobile-app-name"
              type="text"
              autoFocus
              value={field.value}
              onChange={onChange}
              hasError={field.touched && !field.valid}
              className={locals.input}
              disabled={loading}
            />
            <Button
              type="submit"
              kind="create"
              disabled={loading || (field.touched && !field.valid)}
              className={locals.button}
            >
              Add Mobile App
            </Button>
          </div>

          {field.touched &&
            field.messages.map((message, i) => (
              <ValidationBlock hasError key={i}>
                {message.message}
              </ValidationBlock>
            ))}
        </FormGroup>
      </form>
    </Frame>
  );
}
