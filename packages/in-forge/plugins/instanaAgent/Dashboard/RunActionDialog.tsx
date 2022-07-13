/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import { createField, createMapForm } from 'formalistic';
import React, { useState } from 'react';

import { Button } from '@instana/components';

import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import { runAction3 } from 'in-forge/plugins/instanaAgent/actions';
import { notBlankValidator } from 'in-services/validators/string';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { close } from 'in-components/DialogPresenter/store';
import FormGroup from 'in-components/form/FormGroup';
import Dialog from 'in-components/Dialog/Dialog';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';
import Code from 'in-components/Code';
import { t } from 'in-i18n';

import locals from './RunActionDialog.mless';

const { DashboardNotification } = require('in-sdk/components/dashboard/DashboardNotification');

export function RunActionDialog() {
  const codeTargetId = 'configurationManagement';
  const [code, setCode] = useState('');
  const [form, setForm] = useState(
    createMapForm().put(
      'inputCommand',
      createField({
        value: '',
        validator: notBlankValidator
      })
    )
  );

  var response = { data: { stdout: '' }, error: undefined };

  return (
    <Dialog title={t('in-forge:plugins.instanaAgent.dashboard.configurationManagement')} onClose={close}>
      <form
        onSubmit={e => {
          e.preventDefault();
          save(form.toJS(), setCode);
        }}
      >
        {FormField('inputCommand', 'Enter command', form, setForm)};
        <Button kind="create" type="submit" disabled={!form.hierarchyValid}>
          {t('in-forge:plugins.instanaAgent.dashboard.runCommand')}
        </Button>
        {!response && <LoadingIndicator size={'xl'} />}
        {response && response.error && (
          <DashboardNotification type="danger">
            {t('in-forge:plugins.instanaAgent.dashboard.error', { error: response.error })}
          </DashboardNotification>
        )}
        {response && (
          <div className={locals.codeAction}>
            <Code code={code} showLineNumbers={false} id={codeTargetId} lang="bash" withoutCopyButton />
          </div>
        )}
      </form>
    </Dialog>
  );
}

function FormField(fieldName: string, label: string, form: any, setForm: Function) {
  return form.get(fieldName).map((field: any) => (
    <FormGroup>
      <Label htmlFor={fieldName}>{label}</Label>
      <Input
        id={fieldName}
        value={field.value}
        hasError={!field.valid}
        onChange={e => setForm(form.updateIn([fieldName], (f: any) => f.setValue(e.target.value).setTouched(true)))}
      />
      <TouchedMessages field={field} />
    </FormGroup>
  ));
}
function save(form: any, setCode: Function) {
  return runAction3(form.inputCommand, 'configurationManagement').once((agentResponse: any) => {
    setCode(agentResponse.data.output || agentResponse.data.errorMessage);
  });
}
