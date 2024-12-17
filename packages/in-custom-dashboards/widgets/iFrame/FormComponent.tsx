/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Stack } from '@instana/components';

import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import { IFrameWidgetForm } from 'in-custom-dashboards/widgets/iFrame/form';
import InputInSection from 'in-components/form/Input/InputInSection';
import Header from 'in-components/workspace/Header';
import { t } from 'in-i18n';

export interface iFrameFormComponentProps {
  form: IFrameWidgetForm;
  onChange: (path: string[], updater: (f: any) => any) => void;
}

export default function IFrameFormComponent({ form, onChange }: iFrameFormComponentProps) {
  const urlField = form.get('iframe');
  return (
    <Stack gap="normal">
      <Header>{t('in-custom-dashboards:widgets.iFrame.form.heading')}</Header>
      <InputInSection
        id="user-url-input"
        label={t('in-custom-dashboards:widgets.iFrame.form.title')}
        onChange={e => {
          onChange(['iframe'], field => field.setValue(e.target.value).setTouched(true));
        }}
        value={urlField.value}
        hasError={!urlField.valid && urlField.touched}
        maxLength={512}
        additionalContent={<TouchedMessages field={urlField} />}
      />
    </Stack>
  );
}
