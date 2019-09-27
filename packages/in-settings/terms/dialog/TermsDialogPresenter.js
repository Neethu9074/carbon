import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Dialog from 'in-new-components/Dialog/Dialog';
import TermsPage1 from './TermsPage1';
import TermsPage2 from './TermsPage2';

import locals from './TermsDialogPresenter.mless';

export default function TermsDialogPresenter({ form, onChange, onSave, saveError, unsetSaveError, isOnPrem = false }) {
  const [pageNumber, setPageNumber] = useState(1);

  return (
    <Dialog
      title="Preferences"
      renderCustomCloseBehaviour={() =>
        pageNumber === 2 ? (
          <span className={locals.customDialogClose} onClick={e => onSave(e, form)}>
            Set up later
          </span>
        ) : null
      }
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
            isOnPrem={isOnPrem}
          />
        )}
      </form>
    </Dialog>
  );
}

TermsDialogPresenter.propTypes = {
  userSettings: PropTypes.shape({
    allAnalyticsServices: PropTypes.bool.isRequired,
    allSupportAndResearchServices: PropTypes.bool.isRequired,
    lastUpdated: PropTypes.number.isRequired,
    marketingMessages: PropTypes.bool.isRequired,
    productTips: PropTypes.bool.isRequired,
    role: PropTypes.string,
    testingGroup: PropTypes.bool.isRequired,
    userId: PropTypes.string
  }).isRequired,
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  saveError: PropTypes.bool,
  unsetSaveError: PropTypes.func,
  isOnPrem: PropTypes.bool
};
