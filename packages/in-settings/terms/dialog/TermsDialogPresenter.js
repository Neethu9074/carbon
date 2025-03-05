/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import TermsPageProfile from 'in-settings/terms/dialog/TermsPageProfile';
import Dialog from 'in-components/Dialog/Dialog';
import { t } from 'in-i18n';

import locals from './TermsDialogPresenter.mless';

export default function TermsDialogPresenter({
  form,
  onChange,
  onSave,
  saveError,
  unsetSaveError,
  userName,
  userEmail
}) {
  return (
    <Dialog title={t('in-settings:terms.preferences')} doNotCloseOnOutsideClick withoutBodyPadding>
      <form onSubmit={e => onSave(e, form)} className={locals.dialogContent}>
        <TermsPageProfile
          onChange={onChange}
          form={form}
          hasErrorOnSave={saveError}
          unsetSaveError={unsetSaveError}
          userName={userName}
          userEmail={userEmail}
        />
      </form>
    </Dialog>
  );
}

TermsDialogPresenter.propTypes = {
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  saveError: PropTypes.bool,
  unsetSaveError: PropTypes.func,
  userName: PropTypes.string,
  userEmail: PropTypes.string
};
