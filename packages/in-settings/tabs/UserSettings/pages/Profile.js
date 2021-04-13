/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createField, notBlankValidator } from 'formalistic';
import React from 'react';

import { success, neutral, error as errorType } from 'in-new-components/Message/types';
import { updateUser } from 'in-settings/tabs/UserSettings/api/user';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import ApiItemView from 'in-settings/components/ApiItemView';
import FormGroup from 'in-components/form/FormGroup';
import Section from 'in-settings/components/Section';
import Title from 'in-components/Title/Title';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import { user } from 'in-stores/user';
import { t } from 'in-i18n';

export default function UiConfigProfilePage() {
  return <ApiItemView Content={Content} enrichForm={enrichForm} onSubmit={onSubmit} fullName={user.fullName} />;
}

function Content({ form, setForm }) {
  const field = form.get('fullName');

  return (
    <>
      <Title title={t('in-settings:tabs.profile')} />
      <SubViewHeader>{t('in-settings:tabs.profileSettings')}</SubViewHeader>
      <Section restrictWidth="25rem">
        <FormGroup>
          <Label htmlFor="fullName" hasError={!field.valid && field.touched}>
            {t('in-settings:tabs.name')}
          </Label>
          <Input
            type="text"
            id="fullName"
            value={field.value}
            onChange={e =>
              setForm(form.updateIn(['fullName'], field => field.setValue(e.target.value || '').setTouched(true)))
            }
            autoComplete="off"
            hasError={!field.valid && field.touched}
            autoFocus
          />
        </FormGroup>
      </Section>
    </>
  );
}

function onSubmit(e, props) {
  e.preventDefault();

  const { form, setForm } = props;
  if (!form.hierarchyValid) {
    return setForm(form.setTouched(true, { recurse: true }));
  }

  saveItem(props);
}

function saveItem({ form, setMessage }) {
  setMessage({
    message: t('in-settings:tabs.savingNewName'),
    type: neutral,
    isSaving: true
  });
  const updateUserResult$ = updateUser(user.email, form.toJS());
  updateUserResult$.once(
    () => {
      setMessage({ text: t('in-settings:tabs.nameChanged'), type: success });
      window.location.reload();
    },
    error => setMessage({ text: t('in-settings:tabs.failedToChangeName', { err: error.message }), type: errorType })
  );
}

function enrichForm(form, { fullName }) {
  return form.put(
    'fullName',
    createField({
      value: fullName,
      validator: notBlankValidator
    })
  );
}
