/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Button } from '@instana/components';

import ValidationBlock from 'in-components/form/ValidationBlock';
import Paragraph from 'in-websites/NewWebsiteFlow/Paragraph';
import Frame from 'in-websites/NewWebsiteFlow/Frame';
import SaveError from 'in-components/form/SaveError';
import FormGroup from 'in-components/form/FormGroup';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import { t } from 'in-i18n';

import locals from './InputStep.mless';

export default function InputStep({ onSubmit, saveError, field, onChange, loading }) {
  return (
    <Frame title={t('in-websites:newWebsiteFlow.inputStepTitleAddWebsite')}>
      <Paragraph>{t('in-websites:newWebsiteFlow.inputStepParagraphGetStarted')}</Paragraph>

      <form onSubmit={onSubmit}>
        <FormGroup className={locals.group}>
          <Label htmlFor="website-name">{t('in-websites:newWebsiteFlow.inputStepLabelWebsiteName')}</Label>

          {saveError && <SaveError>{saveError}</SaveError>}

          <div className={locals.actionWrapper}>
            <Input
              id="website-name"
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
              {t('in-websites:newWebsiteFlow.inputStepButtonAddWebsite')}
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
