/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Dialog from 'in-new-components/Dialog/Dialog';
import TermsPage1 from './TermsPage1';
import TermsPage2 from './TermsPage2';

import locals from './TermsDialogPresenter.mless';

export default function TermsDialogPresenter({
  form,
  onChange,
  onSave,
  onSkip,
  saveError,
  unsetSaveError,
  fullTermsConfigEnabled
}) {
  const [pageNumber, setPageNumber] = useState(1);

  return (
    <Dialog
      title="Preferences"
      renderCustomCloseBehaviour={() =>
        pageNumber === 2 ? (
          <span className={locals.customDialogClose} onClick={e => onSkip(e, form)}>
            Set up later
          </span>
        ) : null
      }
      doNotCloseOnOutsideClick
    >
      <form onSubmit={e => onSave(e, form)} className={locals.dialogContent}>
        {pageNumber === 1 && <TermsPage1 onNext={setPageNumber} onChange={onChange} form={form} />}
        {pageNumber === 2 && (
          <TermsPage2
            onBack={setPageNumber}
            onChange={onChange}
            form={form}
            hasErrorOnSave={saveError}
            unsetSaveError={unsetSaveError}
            fullTermsConfigEnabled={fullTermsConfigEnabled}
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
  onSkip: PropTypes.func.isRequired,
  saveError: PropTypes.bool,
  unsetSaveError: PropTypes.func,
  fullTermsConfigEnabled: PropTypes.bool
};
