/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ServicesAndEndpointsListPresenter from './ServicesAndEndpointsListPresenter/ServicesAndEndpointsListPresenter';
import getApplicationsCursorPaginated from 'in-subscription/application/getApplicationsCursorPaginated';
import AlertFilterConfigurator from 'in-new-components/Alerting/components/AlertFilterConfigurator';
import getEndpointsCursorPaginated from 'in-applications/subscriptions/getEndpointsCursorPaginated';
import getServicesCursorPaginated from 'in-subscription/application/getServicesCursorPaginated';
import getApplication from 'in-subscription/application/getApplication';

import locals from './ScopeConfig.mless';

export default function ScopeConfig({ form, updateForm, QueryBuilderComponent }) {
  const applications = form.get('applications').value;
  const alertApplicationId = form.get('applicationId').value;
  const boundaryScope = form.get('boundaryScope').value;

  return (
    <>
      <ServicesAndEndpointsListPresenter
        apiSubscriptions={{
          getApplication,
          getApplicationsCursorPaginated,
          getServicesCursorPaginated,
          getEndpointsCursorPaginated
        }}
        applicationsSelection={applications}
        onChange={applicationsSelection =>
          updateForm(form.updateIn(['applications'], field => field.setValue(applicationsSelection).setTouched(true)))
        }
        alertApplicationId={alertApplicationId}
        boundaryScope={boundaryScope}
      />
      <div className={locals.spacer} />

      <AlertFilterConfigurator QueryBuilderComponent={QueryBuilderComponent} form={form} updateForm={updateForm} />
    </>
  );
}
