/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { createField, createMapForm, Field, MapForm, notBlankValidator } from 'formalistic';
import React from 'react';

import {
  Typography,
  CarbonSelect,
  CarbonSelectItem,
  CarbonCheckbox,
  CarbonLayer,
  LoadingSkeleton
} from '@instana/components';
import { useObservable } from '@instana/hooks';

import MapFormProvider, { useMapFormContext } from 'in-settings/components/MapFormProvider/MapFormProvider';
import { fullTermsConfigEnabled, tealiumPrivacyEnabled } from 'in-services/featureFlags';
import FormFooter, { SaveButton } from 'in-components/form/FormFooter/FormFooter';
import DescriptionText from 'in-components/form/DescriptionText/DescriptionText';
import { saveUserSettingsAsObservable } from 'in-settings/api/userSettings';
import { getUserInfo, updateUserName } from 'in-settings/api/userProfile';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { UserSettings } from 'in-services/userSettings/globals';
import FormGroup from 'in-components/form/FormGroup/FormGroup';
import { saveUserSettings } from 'in-services/userSettings';
import useFormSubmission from 'in-hooks/useFormSubmission';
import { pendingResult } from 'in-services/fixedObjects';
import useDerivedState from 'in-hooks/useDerivedState';
import { roles } from 'in-settings/terms/rolesConfig';
import { isLoading } from 'in-services/util/result';
import Label from 'in-components/form/Label/Label';
import Input from 'in-components/form/Input/Input';
import { t } from 'in-i18n';

import locals from 'in-settings/tabs/UserSettings/pages/Profile/Profile.mless';

const PROFILE_FORM_ID = 'profile-form';

export type ProfileFormFields = {
  fullName: Field<string | undefined>;
  email: Field<string | undefined>;
  termsAndPrivacySettings: Field<Record<string, any>>;
};

export type ProfileFormValues = {
  fullName: string;
  email: string;
  termsAndPrivacySettings: Record<string, any>;
};

export function createProfileForm(formValues: ProfileFormValues): MapForm<ProfileFormFields> {
  return createMapForm<ProfileFormFields>({
    items: {
      fullName: createField({ value: formValues?.fullName, validator: notBlankValidator }),
      email: createField({
        value: formValues?.email,
        validator: notBlankValidator
      }),
      termsAndPrivacySettings: createField({
        value: formValues?.termsAndPrivacySettings
      })
    }
  });
}

export default function ProfileNew() {
  const user = useObservable(getUserInfo(), []) ?? pendingResult;
  const formValues = {
    ...(user?.data ?? {}),
    termsAndPrivacySettings: window.instana.termsAndPrivacySettings
  };
  const [form, setForm] = useDerivedState(createProfileForm(formValues));
  const [statusName, submitName] = useFormSubmission(updateUserName);
  const [statusSettings, submitRoleOrCheckbox] = useFormSubmission(saveUserSettingsAsObservable);

  if (isLoading(user)) {
    return <LoadingSkeleton data-testid="loading-skeleton" />;
  }

  function onSubmit() {
    if (!form.hierarchyValid) {
      // In case user clicks on save button and the form is in invalid state we
      // cancel the submission request and set the form to touched in order to
      // show validation messages to the user.
      return setForm(form.setTouched(true));
    }

    const payload = form.toJS();
    const fullNameField = form.getIn(['fullName']);
    const termsAndPrivacySettingsField = form.getIn(['termsAndPrivacySettings']);
    const nameField = payload.fullName;
    const termsField = payload.termsAndPrivacySettings;
    const nameTouched = fullNameField.touched;
    const termsTouched = termsAndPrivacySettingsField.touched;

    if (nameTouched) {
      submitName({
        payload: nameField,
        onError: () => {
          addMessage({
            type: 'danger',
            content: t('in-components:error.serverErrorInfo')
          });
        },
        onSuccess: () => {
          addMessage({
            type: 'success',
            content: t('in-settings:tabs.profile.savedProfile')
          });
        }
      });
    }

    if (termsTouched) {
      saveUserSettings(termsField, savedBackendSettings => {
        window.instana.termsAndPrivacySettings = savedBackendSettings as UserSettings;
      });
      submitRoleOrCheckbox({
        payload: termsField,
        onError: () => {
          addMessage({
            type: 'danger',
            content: t('in-components:error.serverErrorInfo')
          });
        },
        onSuccess: () => {
          addMessage({
            type: 'success',
            content: t('in-settings:tabs.profile.savedProfile')
          });
        }
      });
    }
  }

  return (
    <div className={locals.background}>
      <SubViewHeader>{t('in-settings:tabs.profile.pageName')}</SubViewHeader>
      <MapFormProvider id={PROFILE_FORM_ID} form={form} mode="edit" updateForm={setForm}>
        <CarbonLayer>
          <EmailField />
          <NameField />
          {tealiumPrivacyEnabled && <RoleField />}
          {tealiumPrivacyEnabled && <CheckboxField />}
        </CarbonLayer>
        <CarbonLayer>
          <FormFooter className={locals.footer}>
            <SaveButton
              onClick={onSubmit}
              disabled={!form.hierarchyTouched || (statusName || statusSettings) === 'pending'}
              form={form}
            />
          </FormFooter>
        </CarbonLayer>
      </MapFormProvider>
    </div>
  );
}

const EmailField = () => {
  const { form } = useMapFormContext<ProfileFormFields>(PROFILE_FORM_ID);
  const emailField = form.getIn(['email']);
  return (
    <FormGroup key="email">
      <Label htmlFor="email">{t('in-settings:tabs.profile.email')}</Label>
      <Typography variant="body-regular" component="p" noMargin>
        {emailField.value}
      </Typography>
      <DescriptionText> {t('in-settings:tabs.profile.emailHint')}</DescriptionText>
    </FormGroup>
  );
};

const NameField = () => {
  const { form, updateIn } = useMapFormContext<ProfileFormFields>(PROFILE_FORM_ID);
  const nameField = form.getIn(['fullName']);
  return (
    <FormGroup key="name">
      <Label htmlFor="profile_name" hasError={!nameField.valid && nameField.touched}>
        {t('in-settings:tabs.profile.name')}
      </Label>
      <Input
        id="profile_name"
        type="text"
        placeholder={t('in-settings:tabs.profile.name')}
        autoComplete="off"
        onChange={e => {
          updateIn(['fullName'], nameField.setValue(e.target.value).setTouched(true));
        }}
        defaultValue={nameField.value}
        hasError={!nameField.valid && nameField.touched}
        autoFocus
      />
      <TouchedMessages field={nameField} />
      <DescriptionText>{t('in-settings:tabs.profile.nameHint')}</DescriptionText>
    </FormGroup>
  );
};

const RoleField = () => {
  const { form, updateIn } = useMapFormContext<ProfileFormFields>(PROFILE_FORM_ID);
  const termsField = form.getIn(['termsAndPrivacySettings']);
  const roleValue = termsField?.value.role;
  const dynamicRoleValue = termsField?.value.dynamicRole;
  return (
    <>
      <FormGroup>
        <CarbonSelect
          name="role"
          value={roleValue}
          onChange={e =>
            updateIn(
              ['termsAndPrivacySettings'],
              termsField
                .setValue({
                  ...termsField.value,
                  role: e.target.value
                })
                .setTouched(true)
            )
          }
          id="role-selection"
          labelText={t('in-settings:terms.role')}
        >
          {roles.map(({ value, label }) => (
            <CarbonSelectItem key={value} value={value} text={label} />
          ))}
        </CarbonSelect>
      </FormGroup>

      {roleValue === 'other' && (
        <FormGroup>
          <Label htmlFor="dynamic-role-selection">{t('in-settings:terms.whatIsYourRole')}</Label>
          <Input
            id="dynamic-role-selection"
            name="dynamic-role-selection"
            data-testid="dynamic-role-selection"
            type="text"
            value={dynamicRoleValue}
            onChange={e =>
              updateIn(
                ['termsAndPrivacySettings'],
                termsField
                  .setValue({
                    ...termsField.value,
                    dynamicRole: e.target.value || ''
                  })
                  .setTouched(true)
              )
            }
            hasError={termsField.touched && !termsField.valid}
          />
          <TouchedMessages field={termsField} />
        </FormGroup>
      )}
    </>
  );
};

const CheckboxField = () => {
  const { form, updateIn } = useMapFormContext<ProfileFormFields>(PROFILE_FORM_ID);
  if (!fullTermsConfigEnabled) {
    return null;
  }
  const termsField = form.getIn(['termsAndPrivacySettings']);
  const checkboxValue = termsField?.value.testingGroup ?? false;
  return (
    <FormGroup>
      <CarbonCheckbox
        id="user-testing-group"
        data-testid="testing-group"
        labelText={t('in-settings:tabs.userTestingGroup')}
        hideLabel
        className={locals.profileCheckbox}
        helperText={t('in-settings:tabs.profileCheckboxText')}
        checked={checkboxValue}
        onChange={e =>
          updateIn(
            ['termsAndPrivacySettings'],
            termsField
              .setValue({
                ...termsField.value,
                testingGroup: e.target.checked
              })
              .setTouched(true)
          )
        }
      />
    </FormGroup>
  );
};
