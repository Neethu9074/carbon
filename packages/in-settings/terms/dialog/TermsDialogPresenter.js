/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';

import TermsPageMessaging from 'in-settings/terms/dialog/TermsPageMessaging';
import TermsPageCookies from 'in-settings/terms/dialog/TermsPageCookies';
import TermsPageProfile from 'in-settings/terms/dialog/TermsPageProfile';
import { tealiumPrivacyEnabled } from 'in-services/featureFlags';
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
  userEmail,
  fullTermsConfigEnabled
}) {
  const [pageNumber, setPageNumber] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const nrPages = tealiumPrivacyEnabled ? 0 : fullTermsConfigEnabled ? 3 : 2;

  function handleSave(formToSave) {
    onSave(null, formToSave);
    setIsModalOpen(false);
  }
  if (tealiumPrivacyEnabled) {
    return (
      <TermsPageProfile
        onBack={setPageNumber}
        onChange={onChange}
        onSave={handleSave}
        open={isModalOpen}
        form={form}
        pageNumber={2}
        hasErrorOnSave={saveError}
        fullTermsConfigEnabled={fullTermsConfigEnabled}
        nrPages={nrPages}
        unsetSaveError={unsetSaveError}
        userName={userName}
        userEmail={userEmail}
      />
    );
  }
  return (
    <Dialog title={t('in-settings:terms.preferences')} doNotCloseOnOutsideClick withoutBodyPadding>
      <form onSubmit={e => onSave(e, form)} className={locals.dialogContent}>
        {pageNumber === 1 && (
          <TermsPageMessaging
            onNext={setPageNumber}
            onChange={onChange}
            form={form}
            nrPages={nrPages}
            fullTermsConfigEnabled={fullTermsConfigEnabled}
          />
        )}

        {fullTermsConfigEnabled && pageNumber === 2 && (
          <TermsPageCookies
            onBack={setPageNumber}
            onNext={setPageNumber}
            onChange={onChange}
            form={form}
            nrPages={nrPages}
          />
        )}

        {!fullTermsConfigEnabled && pageNumber === 2 && (
          <TermsPageProfile
            onBack={setPageNumber}
            onChange={onChange}
            onSave={onSave}
            open
            form={form}
            pageNumber={2}
            hasErrorOnSave={saveError}
            fullTermsConfigEnabled={fullTermsConfigEnabled}
            nrPages={nrPages}
            unsetSaveError={unsetSaveError}
            userName={userName}
            userEmail={userEmail}
          />
        )}

        {pageNumber === 3 && (
          <TermsPageProfile
            onBack={setPageNumber}
            onChange={onChange}
            onSave={onSave}
            open
            form={form}
            pageNumber={3}
            fullTermsConfigEnabled={fullTermsConfigEnabled}
            hasErrorOnSave={saveError}
            unsetSaveError={unsetSaveError}
            nrPages={nrPages}
            userName={userName}
            userEmail={userEmail}
          />
        )}
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
  userEmail: PropTypes.string,
  fullTermsConfigEnabled: PropTypes.bool
};
