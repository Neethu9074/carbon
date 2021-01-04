import { createField, notBlankValidator } from 'formalistic';
import React, { useMemo } from 'react';
import zxcvbn from 'zxcvbn';

import { success, neutral, error as errorType } from 'in-new-components/Message/types';
import { changePassword } from 'in-settings/tabs/AuthSettings/api/changePassword';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { stringMaxLengthValidator } from 'in-services/validators/string';
import TouchedMessages from 'in-components/form/TouchedMessages';
import ValidationBlock from 'in-components/form/ValidationBlock';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import ApiItemView from 'in-settings/components/ApiItemView';
import FormGroup from 'in-components/form/FormGroup';
import Section from 'in-settings/components/Section';
import Title from 'in-components/Title/Title';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';

import locals from './ChangePassword.mless';

export default function ChangePassword() {
  return <ApiItemView Content={Content} enrichForm={enrichForm} onSubmit={onSubmit} />;
}

function Content({ form, setForm }) {
  const newPassword = form.get('newPassword').value;
  const passwordStrength = useMemo(() => getPasswordStrength(newPassword), [newPassword]);

  return (
    <>
      <Title title="Change Password" />
      <SubViewHeader>Change Password</SubViewHeader>
      <Section restrictWidth="50rem">
        <InputField label="Password" fieldName="password" form={form} setForm={setForm} autoFocus />
        <InputField
          label="New password"
          fieldName="newPassword"
          form={form}
          setForm={setForm}
          passwordStrength={passwordStrength}
        />
        <InputField label="Repeat password" fieldName="repeatedPassword" form={form} setForm={setForm} />
      </Section>
    </>
  );
}

function InputField({ label, fieldName, autoFocus, form, setForm, passwordStrength }) {
  const field = form.get(fieldName);
  return (
    <FormGroup>
      <Label htmlFor={fieldName} hasError={!field.valid && field.touched}>
        {label}
      </Label>
      <Input
        type="password"
        id={fieldName}
        value={field.value}
        onChange={e =>
          setForm(form.updateIn([fieldName], field => field.setValue(e.target.value || '').setTouched(true)))
        }
        autoComplete="off"
        hasError={!field.valid && field.touched}
        autoFocus={autoFocus}
      />
      {passwordStrength && field.value ? (
        <ValidationBlock className={locals[`score_${passwordStrength.score}`]}>
          The password is {passwordStrength.text}.
        </ValidationBlock>
      ) : (
        <TouchedMessages field={field} />
      )}
    </FormGroup>
  );
}

function getPasswordStrength(password) {
  const strength = zxcvbn(password);
  return {
    text: ['very weak', 'weak', 'weak', 'strong', 'very strong'][strength.score],
    score: strength.score
  };
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
  setMessage({ message: 'Saving new password', type: neutral, isSaving: true });
  const setRoleResult$ = changePassword(form.toJS());
  setRoleResult$.once(
    () => setMessage({ text: 'Password changed.', type: success }),
    error => setMessage({ text: `Failed to change password: ${error.message}`, type: errorType })
  );
}

function enrichForm(form) {
  return form
    .put(
      'password',
      createField({
        value: '',
        validator: composeAndShortCircuitOnError(notBlankValidator, stringMaxLengthValidator(128))
      })
    )
    .put(
      'newPassword',
      createField({
        value: '',
        validator: composeAndShortCircuitOnError(notBlankValidator, stringMaxLengthValidator(128), validatePassword)
      })
    )
    .put(
      'repeatedPassword',
      createField({
        value: '',
        validator: composeAndShortCircuitOnError(notBlankValidator, stringMaxLengthValidator(128))
      })
    );
}

function validatePassword(password) {
  const strength = getPasswordStrength(password);
  if (strength.score < 3) {
    return [
      {
        severity: 'error',
        message: 'The password is not strong enough.'
      }
    ];
  }
}
