/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { SvgIcon, Button, Typography, Stack } from '@instana/components';
import { Modal, Checkbox, TextInput } from '@instana/carbon';

import { isControlledEnvEnabled, tealiumPrivacyEnabled } from 'in-services/featureFlags';
import FreetrialRoleSelector from 'in-plg/components/NoviceToPro/FreetrialRoleSelector';
import TermsProgressIndicator from 'in-settings/terms/dialog/TermsProgressIndicator';
import { addDynamicRoleField } from 'in-settings/terms/termsFormDefinition';
import FormFooter from 'in-components/form/FormFooter/FormFooter';
import RolesSelector from 'in-settings/terms/RolesSelector';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import { config } from 'in-services/config';
import { t } from 'in-i18n';

import locals from './TermsPages.mless';

export default function TermsPageProfile({
  onBack,
  onChange,
  open,
  onSave,
  form,
  hasErrorOnSave = false,
  unsetSaveError,
  userName,
  userEmail,
  pageNumber,
  fullTermsConfigEnabled,
  nrPages
}) {
  const { activeLicenseType } = config;
  const isTrial = activeLicenseType === 'selfService';
  const isRoleMessagePresent = form.get('dynamicRole')?.valid;
  function handleSubmit() {
    onSave(form);
  }
  function handleSubmitFreeTrial() {
    let updatedForm = form.updateIn(['role'], field => field.setValue(selectedRole));
    updatedForm = updatedForm.updateIn(['testingGroup'], field => field.setValue(checked));
    if (selectedRole === 'other') {
      updatedForm = addDynamicRoleField(updatedForm, { dynamicRole: customRole });
      updatedForm = updatedForm.updateIn(['dynamicRole'], field => field.setValue(customRole));
    }
    onSave(updatedForm);
  }
  const [selectedRole, setSelectedRole] = useState(null);
  const [customRole, setCustomRole] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [checked, setChecked] = useState(false);

  const errorWarningMessages = (
    <>
      <div
        className={classNames({
          [locals.errorText]: true,
          [locals.hidden]: !hasErrorOnSave
        })}
      >
        <SvgIcon className={locals.icon} type="lib_help_error_error_circle" size="s" />
        <span>{t('in-settings:termsDialog.unableToSaveText')}</span>
      </div>

      {isRoleMessagePresent && (
        <div
          className={classNames({
            [locals.warningText]: true,
            [locals.hidden]: !isRoleMessagePresent || form.hierarchyValid
          })}
        >
          <SvgIcon className={locals.icon} type="lib_help_error_error_circle" size="s" />
          <span>{t('in-settings:termsDialog.roleNeededText')}</span>
        </div>
      )}
    </>
  );
  if (isTrial) {
    return (
      <FreetrialRoleSelector
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
        customRole={customRole}
        setCustomRole={setCustomRole}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        handleSubmit={handleSubmitFreeTrial}
        checked={checked}
        setChecked={setChecked}
      />
    );
  }

  if (tealiumPrivacyEnabled) {
    return (
      <Modal
        className={locals.disableClose}
        modalLabel={t('in-settings:terms.preferences')}
        size="md"
        modalHeading={t('in-settings:termsDialog.termsPage4.heading')}
        primaryButtonText={t('in-settings:termsDialog.save')}
        primaryButtonDisabled={isSubmitDisabled(form)}
        open={open}
        onRequestSubmit={handleSubmit}
      >
        <Stack>
          <Typography variant="body-regular">{t('in-settings:termsDialog.termsPage4.introduction')}</Typography>
          <TextInput
            id="user-name-input"
            labelText={t('in-settings:termsDialog.termsPage4.name')}
            placeholder={userName}
            type="text"
            readOnly
          />
          <TextInput
            id="user-email"
            labelText={t('in-settings:termsDialog.termsPage4.email')}
            placeholder={userEmail}
            type="text"
            readOnly
          />
          <RolesSelector form={form} onChange={(fieldName, value) => onChange(form, fieldName, value)} />
          {fullTermsConfigEnabled &&
            form
              .get('testingGroup')
              .map(
                ({ value }) =>
                  !isControlledEnvEnabled && (
                    <Checkbox
                      id="user-testing-group"
                      labelText={t('in-settings:tabs.userTestingGroup')}
                      hideLabel
                      className={locals.profileCheckbox}
                      helperText={t('in-settings:tabs.profileCheckboxText')}
                      checked={value}
                      onChange={() => onChange(form, 'testingGroup', !value)}
                    />
                  )
              )}
        </Stack>
        {errorWarningMessages}
      </Modal>
    );
  }

  return (
    <div className={locals.container}>
      <div className={locals.pageContent}>
        <TermsProgressIndicator pageNumber={pageNumber} nrPages={nrPages} />
        <h1 className={locals.heading}>{t('in-settings:termsDialog.termsPage4.heading')}</h1>
        <Stack>
          <p>{t('in-settings:termsDialog.termsPage4.introduction')}</p>
          <InputField label={t('in-settings:termsDialog.termsPage4.name')} value={userName} />
          <InputField label={t('in-settings:termsDialog.termsPage4.email')} value={userEmail} />
          <RolesSelector form={form} onChange={(fieldName, value) => onChange(form, fieldName, value)} />
        </Stack>
        {errorWarningMessages}
      </div>

      <FormFooter className={locals.buttons}>
        <Button
          onClick={() => handleBackClick(hasErrorOnSave, unsetSaveError, onBack, fullTermsConfigEnabled)}
          kind="secondary"
        >
          {t('in-settings:termsDialog.back')}
        </Button>
        <Button type="submit" disabled={isSubmitDisabled(form)}>
          {t('in-settings:termsDialog.save')}
        </Button>
      </FormFooter>
    </div>
  );
}

function isSubmitDisabled(form) {
  if (!form.get('role').value) {
    return true;
  }

  if (form.containsKey('dynamicRole')) {
    return !form.get('dynamicRole').valid;
  }

  return false;
}

function InputField({ label, value }) {
  return (
    <div className={locals.inputField}>
      <Label htmlFor={label}>{label}</Label>
      <Input type="text" id={label} value={value} disabled />
    </div>
  );
}

function handleBackClick(hasErrorOnSave, unsetSaveError, onBack, fullTermsConfigEnabled) {
  if (hasErrorOnSave) unsetSaveError();
  if (fullTermsConfigEnabled) {
    onBack(2);
  } else {
    onBack(1);
  }
}

TermsPageProfile.propTypes = {
  onBack: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  onSave: PropTypes.func.isRequired,
  hasErrorOnSave: PropTypes.bool.isRequired,
  unsetSaveError: PropTypes.func.isRequired,
  userName: PropTypes.string,
  userEmail: PropTypes.string,
  pageNumber: PropTypes.number,
  nrPages: PropTypes.number,
  fullTermsConfigEnabled: PropTypes.bool
};
