import React from 'react';

import { applicationsList } from 'in-applications/navigation/paths';
import { getModifiedUrlStream } from 'in-stores/navigation';
import Form from 'in-applications/NewApplication/Form';

import locals from './NewApplicationPresenter.mless';

export default function NewApplicationPresenter({ onSubmit, loading, loadingStateName, error }) {
  return (
    <div className={locals.wrapper}>
      <h1 className={locals.heading}>New Application</h1>

      {error && (
        <div className={locals.errorContainer}>
          <div>Application could not be saved or is already available.</div>
        </div>
      )}

      <Form
        onSubmit={onSubmit}
        loading={loading}
        loadingStateName={loadingStateName}
        error={error}
        hrefOnCancel$={getModifiedUrlStream(p => (p.pathname = applicationsList))}
      />
    </div>
  );
}
