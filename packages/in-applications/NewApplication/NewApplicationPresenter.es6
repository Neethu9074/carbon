import React from 'react';

import Form from 'in-applications/NewApplication/Form';

import locals from './NewApplicationPresenter.mless';

export default function NewApplicationPresenter({ onSubmit, loading, loadingStateName, error }) {
  return (
    <div className={locals.wrapper}>
      <h1 className={locals.heading}>New Application</h1>

      <Form onSubmit={onSubmit} loading={loading} loadingStateName={loadingStateName} error={error} />
    </div>
  );
}
