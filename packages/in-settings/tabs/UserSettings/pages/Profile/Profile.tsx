/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { ChangeEvent, FormEvent } from 'react';
import { MapForm, createField } from 'formalistic';

import { Typography } from '@instana/components';

import { MessageProps, RenderProps } from 'in-settings/tabs/UserSettings/pages/Profile/apiItemViewDefinitions';
// @ts-expect-error no typings...
import ApiItemView from 'in-settings/components/ApiItemView';
import DescriptionText from 'in-components/form/DescriptionText/DescriptionText';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import { getUserInfo, updateUserName } from 'in-settings/api/userProfile';
import { notBlankValidator } from 'in-services/validators/string';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import FormGroup from 'in-components/form/FormGroup/FormGroup';
import Section from 'in-settings/components/Section';
import Label from 'in-components/form/Label/Label';
import Input from 'in-components/form/Input/Input';
import Title from 'in-components/Title/Title';
import { t } from 'in-i18n';

function enrichForm(form: MapForm<any>, data: { result: any } | undefined) {
  return form
    .put(
      'fullName',
      createField({
        value: data?.result?.user?.fullName,
        validator: notBlankValidator
      })
    )
    .put('email', createField({ value: data?.result?.user?.email }));
}

function render({ form, setForm, user, setCanSaveItem }: RenderProps) {
  const changeFullname = (e: ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    const updated = form.updateIn(['fullName'], f => f.setValue(next).setTouched(next !== user?.fullName));
    setForm(updated);

    if (next === user?.fullName) {
      setCanSaveItem(false);
    }
  };

  return (
    <Section restrictWidth="50rem">
      <Title title={t('in-settings:tabs.profile.pageName')} />
      <SubViewHeader>{t('in-settings:tabs.profile.pageName')}</SubViewHeader>
      {form.get('email').map((f: any) => (
        <FormGroup key="email">
          <Label htmlFor="email">{t('in-settings:tabs.profile.email')}</Label>
          <Typography variant="body-regular" component="p" noMargin>
            {f.value}
          </Typography>
          <DescriptionText> {t('in-settings:tabs.profile.emailHint')}</DescriptionText>
        </FormGroup>
      ))}
      {form.get('fullName').map((f: any) => (
        <FormGroup key="name">
          <Label htmlFor="profile_name" hasError={!f.valid && f.touched}>
            {t('in-settings:tabs.profile.name')}
          </Label>
          <Input
            id="profile_name"
            type="text"
            placeholder={t('in-settings:tabs.profile.name')}
            autoComplete="off"
            onChange={changeFullname}
            defaultValue={f.value}
            hasError={!f.valid && f.touched}
            autoFocus
          />
          <TouchedMessages field={f} />
          <DescriptionText>{t('in-settings:tabs.profile.nameHint')}</DescriptionText>
        </FormGroup>
      ))}
    </Section>
  );
}

// currently the users name is stored within the window object and only fetched during the initial page load
// hakisch way to ensure that the name is correctly set whilst navigating to the new home-page.
const setUserNameLocally = (nextName: string) => {
  // @ts-expect-error global access (window)
  window.instana.user.preferredName = nextName;
  // @ts-expect-error global access (window)
  window.instana.user.fullName = nextName;
};

function onSubmit(e: FormEvent, { form, setMessage }: { form: MapForm<any>; setMessage: (msg: MessageProps) => void }) {
  e.preventDefault();
  const setTemporaryMessage = (message: string, type: string, isSaving: boolean = false) =>
    setMessage({ isSaving, type, message });
  if (form.hierarchyValid && form.hierarchyTouched) {
    setTemporaryMessage(t('in-settings:tabs.profile.saving'), 'neutral', true);
    const nextName = form.get('fullName').value;
    updateUserName(nextName).once(
      () => {
        setTemporaryMessage(t('in-settings:tabs.profile.saved'), 'success');
        setUserNameLocally(nextName);
      },
      () => setTemporaryMessage(t('in-settings:tabs.profile.failed'), 'error')
    );
  }
}

export default function Profile() {
  return (
    <ApiItemView
      getObservables={() => ({ user: getUserInfo() })}
      render={render}
      enrichForm={enrichForm}
      onSubmit={onSubmit}
    />
  );
}
