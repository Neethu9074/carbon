import React from 'react';

import Form from 'in-applications/NewApplication/Form';

import locals from './NewApplicationPresenter.mless';

export default function NewApplicationPresenter({ application, onSubmit, loading, loadingStateName, error }) {
  return (
    <div className={locals.wrapper}>
      <h1 className={locals.heading}>New Application</h1>

      {error && (
        <div className={locals.errorContainer}>
          <div>Application could not be saved or is already available. Please try again.</div>
        </div>
      )}

      <Form
        onSubmit={onSubmit}
        application={application}
        loading={loading}
        loadingStateName={loadingStateName}
        error={error}
      />
    </div>
  );
}
