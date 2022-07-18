/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import { createField, createMapForm, Field, MapForm } from 'formalistic';
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

export interface propsDefinition {
  snapshot: MapForm;
}

export function RunActionDialog(props: propsDefinition) {
  const codeTargetId = 'configurationManagement';
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
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
  const volatileId = props.snapshot.get('volatileId');

  return (
    <Dialog title={t('in-forge:plugins.instanaAgent.dashboard.actionManagement')} onClose={close}>
      <form
        onSubmit={e => {
          e.preventDefault();
          save(form.toJS() as MapForm, setCode, setLoading, volatileId as MapForm);
        }}
      >
        {FormField('inputCommand', t('in-forge:plugins.instanaAgent.dashboard.enterCommand'), form, setForm)}
        <Button kind="create" type="submit" disabled={!form.hierarchyValid}>
          {t('in-forge:plugins.instanaAgent.dashboard.runCommand')}
        </Button>
        {(!response || loading) && <LoadingIndicator size={'xl'} />}
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

function FormField(fieldName: string, label: string, form: MapForm, setForm: (form: MapForm) => void) {
  return (form.get(fieldName) as Field<object>).map((field: any) => (
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
function save(
  form: MapForm,
  setCode: (arg0: string) => void,
  setLoading: (arg0: boolean) => void,
  volatileId: MapForm
) {
  setLoading(true);
  return runAction3(form.get('inputCommand'), volatileId).once((agentResponse: any) => {
    setLoading(false);
    setCode(atob(agentResponse.data.output || agentResponse.data.errorMessage));
  });
}
