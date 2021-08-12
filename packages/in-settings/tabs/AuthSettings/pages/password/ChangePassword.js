/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createField, createMapForm } from 'formalistic';
import zxcvbn from 'zxcvbn';
import React from 'react';

import { changePassword } from 'in-settings/tabs/AuthSettings/api/changePassword';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { stringMaxLengthValidator } from 'in-services/validators/string';
import { notBlankValidator } from 'in-services/validators/string';
import TouchedMessages from 'in-components/form/TouchedMessages';
import ValidationBlock from 'in-components/form/ValidationBlock';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import ApiItemView from 'in-settings/components/ApiItemView';
import FormGroup from 'in-components/form/FormGroup';
import Section from 'in-settings/components/Section';
import HelpText from 'in-components/form/HelpText';
import Title from 'in-components/Title/Title';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import { t } from 'in-i18n';

export default function ChangePassword() {
  return <ApiItemView Content={Content} enrichForm={enrichForm} onSubmit={onSubmit} />;
}

function Content({ form, setForm }) {
  const newPassword = form.get('newPassword');
  const repeatedPassword = form.get('repeatedPassword');
  const passwordsDontMatch = checkPasswordsEquality({ newPassword, repeatedPassword });

  return (
    <>
      <Title title={t('in-settings:tabs.changePassword')} />
      <SubViewHeader>{t('in-settings:tabs.changePassword')}</SubViewHeader>
      <HelpText>{`* ${t('in-settings:tabs.required15CharsMin')}`}</HelpText>
      <HelpText>{`* ${t('in-settings:tabs.required1Number')}`}</HelpText>
      <HelpText>{`* ${t('in-settings:tabs.required1Lower')}`}</HelpText>
      <HelpText>{`* ${t('in-settings:tabs.required1Upper')}`}</HelpText>
      <HelpText>{`* ${t('in-settings:tabs.required1SpecialChar')} (!"#$%&'()*+,-./:;<=>?@[\\]^_\`{|}~)`}</HelpText>
      <HelpText>{`* ${t('in-settings:tabs.requiredNoDictionaryWords')}`}</HelpText>
      <Section restrictWidth="50rem">
        <InputField
          label={t('in-settings:tabs.password')}
          fieldName="password"
          form={form}
          setForm={setForm}
          autoFocus
        />
        <InputField label={t('in-settings:tabs.newPassword')} fieldName="newPassword" form={form} setForm={setForm} />
        <InputField
          label={t('in-settings:tabs.repeatPassword')}
          fieldName="repeatedPassword"
          form={form}
          setForm={setForm}
        />
        {passwordsDontMatch && passwordsDontMatch.length > 0 ? (
          <ValidationBlock>{passwordsDontMatch[0].message}</ValidationBlock>
        ) : (
          <></>
        )}
      </Section>
    </>
  );
}

function InputField({ label, fieldName, autoFocus, form, setForm }) {
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
      <TouchedMessages field={field} />
    </FormGroup>
  );
}

function getStrengthGivenPassword(pass) {
  if (pass.length < 15) {
    return {
      classification: 'tooFewChars',
      isOK: false
    };
  }
  if (!pass.match(/.*\d.*/g)) {
    return {
      classification: 'needsANumber',
      isOK: false
    };
  }
  if (!pass.match(/.*[a-z].*/g)) {
    return {
      classification: 'needsALower',
      isOK: false
    };
  }
  if (!pass.match(/.*[A-Z].*/g)) {
    return {
      classification: 'needsAnUpper',
      isOK: false
    };
  }
  if (!pass.match(/.*[\W_].*/g)) {
    return {
      classification: 'needsASpecialChar',
      isOK: false
    };
  }

  const strength = zxcvbn(pass);
  let score = strength.score;
  if (score <= 0) {
    return {
      classification: 'veryWeak',
      warning: strength.feedback?.warning,
      isOK: false
    };
  }
  if (score === 1) {
    return {
      classification: 'veryWeak',
      warning: strength.feedback?.warning,
      isOK: false
    };
  }
  if (score === 2) {
    return {
      classification: 'medium',
      warning: strength.feedback?.warning,
      isOK: false
    };
  }
  if (score === 3) {
    return {
      classification: 'strong',
      isOK: true
    };
  }

  return {
    classification: 'veryStrong',
    isOK: true
  };
}

function getPasswordStrength(password) {
  const strength = getStrengthGivenPassword(password);
  const texts = {
    veryWeak: t('in-settings:tabs.thePasswordIsVeryWeak'),
    weak: t('in-settings:tabs.thePasswordIsWeak'),
    medium: t('in-settings:tabs.thePasswordIsWeak'),
    strong: '',
    veryStrong: '',
    tooFewChars: t('in-settings:tabs.required15CharsMin'),
    needsANumber: t('in-settings:tabs.required1Number'),
    needsALower: t('in-settings:tabs.required1Lower'),
    needsAnUpper: t('in-settings:tabs.required1Upper'),
    needsASpecialChar: `${t('in-settings:tabs.required1SpecialChar')} (!"#$%&'()*+,-./:;<=>?@[\\]^_\`{|}~)`
  };

  return {
    text: texts[strength.classification],
    isOK: strength.isOK
  };
}

function onSubmit(e, props) {
  e.preventDefault();

  const { form, setForm, setMessage } = props;
  if (!form.hierarchyValid) {
    return setForm(form.setTouched(true, { recurse: true }));
  }

  if (form.get('newPassword').value !== form.get('repeatedPassword').value) {
    setMessage({
      message: t('in-settings:tabs.thePasswordsMustBeTheSame'),
      type: 'error',
      isSaving: false
    });
    return form;
  }

  saveItem(props);
}

function saveItem({ form, setMessage }) {
  setMessage({
    message: t('in-settings:tabs.savingNewPassword'),
    type: 'neutral',
    isSaving: true
  });
  const setRoleResult$ = changePassword(form.toJS());
  setRoleResult$.once(
    response => {
      // When changing password, token is invalidated
      // and cookies are deleted so we must redirect to login
      window.location.href = response.body.loginUrl;
    },
    error =>
      setMessage({
        text: t('in-settings:tabs.failedToChangePassword', { err: error.message }),
        type: 'error'
      })
  );
}

function enrichForm() {
  // Recreate the form so we can have a validator of multiple values
  // this can only be done on createMapForm

  return createMapForm({
    validator: checkPasswordsEquality,
    items: {
      password: createField({
        value: '',
        validator: composeAndShortCircuitOnError(notBlankValidator, stringMaxLengthValidator(128))
      }),
      newPassword: createField({
        value: '',
        validator: composeAndShortCircuitOnError(notBlankValidator, stringMaxLengthValidator(128), validatePassword)
      }),
      repeatedPassword: createField({
        value: '',
        validator: composeAndShortCircuitOnError(notBlankValidator, stringMaxLengthValidator(128))
      })
    }
  });
}

function checkPasswordsEquality({ newPassword, repeatedPassword }) {
  if (
    repeatedPassword &&
    newPassword &&
    repeatedPassword.value !== '' &&
    newPassword.value !== repeatedPassword.value
  ) {
    return [
      {
        severity: 'error',
        message: t('in-settings:tabs.thePasswordsMustBeTheSame')
      }
    ];
  }
}

function validatePassword(password) {
  const strength = getPasswordStrength(password);
  if (!strength.isOK) {
    return [
      {
        severity: 'error',
        message: strength.text
      }
    ];
  }
}
