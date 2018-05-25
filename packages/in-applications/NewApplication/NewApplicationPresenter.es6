import React from 'react';

import { applicationsList } from 'in-applications/navigation/paths';
import { getModifiedUrlStream } from 'in-stores/navigation';
import Form from 'in-applications/NewApplication/Form';
import HelpText from 'in-components/form/HelpText';

import locals from './NewApplicationPresenter.mless';

export default function NewApplicationPresenter({ onSubmit, loading, loadingStateName, error }) {
  return (
    <div className={locals.wrapper}>
      <h1 className={locals.heading}>Create Application</h1>

      <HelpText>
        Applications provide a means to model environments, sets of services, tenants, or just about anything. They can
        be thought of as perspectives on services and their endpoints.
      </HelpText>
      <HelpText>
        While a single call can only belong to a single service and endpoint, that call will belong to any application
        that matches the conditions defined below.
      </HelpText>
      <br />

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
