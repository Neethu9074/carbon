/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createField, createMapForm, notBlankValidator } from 'formalistic';
import React, { useState } from 'react';

import { updateConfiguration } from 'in-forge/plugins/instanaAgent/selfMonitoring';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { close } from 'in-components/DialogPresenter/store';
import Dialog from 'in-new-components/Dialog/Dialog';
import FormGroup from 'in-components/form/FormGroup';
import Button from 'in-new-components/Button';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';
import { t } from 'in-i18n';

export default function ConfigurationManagentDialog(props) {
  const [form, setForm] = useState(
    createMapForm()
      .put(
        'volatileId',
        createField({
          value: props.snapshot.get('volatileId')
        })
      )
      .put(
        'remoteName',
        createField({
          value: props.snapshot.getIn(['data', 'git', 'remoteName'], 'configuration'),
          validator: notBlankValidator
        })
      )
      .put(
        'remoteBranch',
        createField({
          value: props.snapshot.getIn(['data', 'git', 'remoteBranch'], 'main'),
          validator: notBlankValidator
        })
      )
      .put(
        'remoteUri',
        createField({
          value: props.snapshot.getIn(['data', 'git', 'remoteUri'], ''),
          validator: notBlankValidator
        })
      )
  );

  return (
    <Dialog title={t('in-forge:plugins.instanaAgent.dashboard.configurationManagement')} onClose={close}>
      <form
        onSubmit={() => {
          updateConfiguration(form.toJS());
          close();
        }}
      >
        <FormField
          fieldName="remoteName"
          label={t('in-forge:plugins.instanaAgent.dashboard.remoteName')}
          form={form}
          setForm={setForm}
        />
        <FormField
          fieldName="remoteBranch"
          label={t('in-forge:plugins.instanaAgent.dashboard.remoteBranch')}
          form={form}
          setForm={setForm}
        />
        <FormField
          fieldName="remoteUri"
          label={t('in-forge:plugins.instanaAgent.dashboard.remoteUri')}
          form={form}
          setForm={setForm}
        />
        <Button kind="create" type="submit" disabled={!form.hierarchyValid}>
          {props.snapshot.getIn(['data', 'git', 'initialized'])
            ? t('in-forge:plugins.instanaAgent.dashboard.updateRestart')
            : t('in-forge:plugins.instanaAgent.dashboard.initializeRestart')}
        </Button>
      </form>
    </Dialog>
  );
}

function FormField({ fieldName, label, form, setForm }) {
  return form.get(fieldName).map(field => (
    <FormGroup>
      <Label htmlFor={fieldName}>{label}</Label>
      <Input
        id={fieldName}
        value={field.value}
        hasError={!field.valid}
        onChange={e => setForm(form.updateIn([fieldName], f => f.setValue(e.target.value).setTouched(true)))}
      />
      <TouchedMessages field={field} />
    </FormGroup>
  ));
}
