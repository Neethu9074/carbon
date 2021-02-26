/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { t } from 'in-i18n';

import TermsPage1 from 'in-settings/terms/dialog/TermsPage1';
import TermsPage2 from 'in-settings/terms/dialog/TermsPage2';
import TermsPage3 from 'in-settings/terms/dialog/TermsPage3';
import TermsPage4 from 'in-settings/terms/dialog/TermsPage4';
import Dialog from 'in-new-components/Dialog/Dialog';

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

  const nrPages = fullTermsConfigEnabled ? 4 : 3;

  return (
    <Dialog title={t('in-settings:terms.preferences')} doNotCloseOnOutsideClick withoutBodyPadding>
      <form onSubmit={e => onSave(e, form)} className={locals.dialogContent}>
        {pageNumber === 1 && <TermsPage1 onNext={setPageNumber} onChange={onChange} form={form} nrPages={nrPages} />}

        {pageNumber === 2 && (
          <TermsPage2
            onBack={setPageNumber}
            onNext={setPageNumber}
            onChange={onChange}
            form={form}
            nrPages={nrPages}
            fullTermsConfigEnabled={fullTermsConfigEnabled}
          />
        )}

        {fullTermsConfigEnabled && pageNumber === 3 && (
          <TermsPage3 onBack={setPageNumber} onNext={setPageNumber} onChange={onChange} form={form} nrPages={nrPages} />
        )}

        {!fullTermsConfigEnabled && pageNumber === 3 && (
          <TermsPage4
            onBack={setPageNumber}
            onChange={onChange}
            form={form}
            pageNumber={3}
            hasErrorOnSave={saveError}
            fullTermsConfigEnabled={fullTermsConfigEnabled}
            nrPages={nrPages}
            unsetSaveError={unsetSaveError}
            userName={userName}
            userEmail={userEmail}
          />
        )}

        {pageNumber === 4 && (
          <TermsPage4
            onBack={setPageNumber}
            onChange={onChange}
            form={form}
            pageNumber={4}
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
