import React from 'react';

import Form from 'in-applications/EditApplication/Form';

import locals from './EditApplicationPresenter.mless';

export default function NewApplicationPresenter({ onSubmit, loading, loadingStateName, error }) {
  return (
    <div className={locals.wrapper}>
      <h1 className={locals.heading}>Edit Application</h1>

      {error && (
        <div className={locals.errorContainer}>
          <div>Application could not be saved. Please try again.</div>
        </div>
      )}

      <Form onSubmit={onSubmit} loading={loading} loadingStateName={loadingStateName} error={error} />
    </div>
  );
}
