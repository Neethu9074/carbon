/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { SvgIcon } from '@instana/components';
import { Button } from '@instana/components';

import FormFooter from 'in-components/form/FormFooter/FormFooter';
import TermsProgressIndicator from './TermsProgressIndicator';
import RolesSelector from 'in-settings/terms/RolesSelector';
import Stack from 'in-components/layout/Stack';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import { t } from 'in-i18n';

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
        <h1 className={locals.heading}>{t('in-settings:termsDialog.termsPage4.heading')}</h1>

        <Stack>
          <p>{t('in-settings:termsDialog.termsPage4.introduction')}</p>

          <InputField label={t('in-settings:termsDialog.termsPage4.name')} value={userName} />

          <InputField label={t('in-settings:termsDialog.termsPage4.email')} value={userEmail} />

          <RolesSelector form={form} onChange={(fieldName, value) => onChange(form, fieldName, value)} />
        </Stack>

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
