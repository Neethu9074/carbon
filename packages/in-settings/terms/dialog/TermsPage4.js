/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import FormFooter from 'in-components/form/FormFooter/FormFooter';
import TermsProgressIndicator from './TermsProgressIndicator';
import RolesSelector from 'in-settings/terms/RolesSelector';
import Button from 'in-new-components/Button/Button';
import SvgIcon from 'in-components/SvgIcon/SvgIcon';
import Stack from 'in-new-components/layout/Stack';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';

import locals from './TermsPages.mless';

export default function TermsPage4({
  onBack,
  onChange,
  form,
  hasErrorOnSave = false,
  unsetSaveError,
  userName,
  userEmail,
  pageNumber,
  fullTermsConfigEnabled,
  nrPages
}) {
  const isRoleMessagePresent = form.get('dynamicRole')?.valid;

  return (
    <div className={locals.container}>
      <div className={locals.pageContent}>
        <TermsProgressIndicator pageNumber={pageNumber} nrPages={nrPages} />
        <h1 className={locals.heading}>Your Profile</h1>

        <Stack>
          <p>
            Set up your profile so your teammates can find you easily. <br />
            You will always be able to change this later in the account settings.
          </p>

          <InputField label="Name" value={userName} />

          <InputField label="Email address" value={userEmail} />

          <RolesSelector form={form} onChange={(fieldName, value) => onChange(form, fieldName, value)} />
        </Stack>

        <div
          className={classNames({
            [locals.errorText]: true,
            [locals.hidden]: !hasErrorOnSave
          })}
        >
          <SvgIcon className={locals.icon} type="lib_help_error_error_circle" size="s" />
          <span>Sorry, we couldn&apos;t save your preferences right now. Please try again.</span>
        </div>

        {isRoleMessagePresent && (
          <div
            className={classNames({
              [locals.warningText]: true,
              [locals.hidden]: !isRoleMessagePresent || form.hierarchyValid
            })}
          >
            <SvgIcon className={locals.icon} type="lib_help_error_error_circle" size="s" />
            <span>You need to type in a role.</span>
          </div>
        )}
      </div>

      <FormFooter className={locals.buttons}>
        <Button
          onClick={() => handleBackClick(hasErrorOnSave, unsetSaveError, onBack, fullTermsConfigEnabled)}
          kind="secondary"
        >
          Back
        </Button>
        <Button type="submit" disabled={isSubmitDisabled(form)}>
          Save
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
    onBack(3);
  } else {
    onBack(2);
  }
}

TermsPage4.propTypes = {
  onBack: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  hasErrorOnSave: PropTypes.bool.isRequired,
  unsetSaveError: PropTypes.func.isRequired,
  userName: PropTypes.string,
  userEmail: PropTypes.string,
  pageNumber: PropTypes.number,
  nrPages: PropTypes.number,
  fullTermsConfigEnabled: PropTypes.bool
};
