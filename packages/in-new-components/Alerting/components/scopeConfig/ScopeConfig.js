import React, { useState } from 'react';

/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import getEndpointsCursorPaginated from 'in-applications/subscriptions/getEndpointsCursorPaginated';
import ServicesAndEndpointsListPresenter from './ServicesAndEndpointsListPresenter/ServicesAndEndpointsListPresenter';
import getApplicationsCursorPaginated from 'in-subscription/application/getApplicationsCursorPaginated';
import AlertFilterConfigurator from 'in-new-components/Alerting/components/AlertFilterConfigurator';
import getServicesCursorPaginated from 'in-subscription/application/getServicesCursorPaginated';
import getApplication from 'in-subscription/application/getApplication';
import useDebouncedValue from 'in-hooks/useDebouncedValue';
import LightCard from 'in-new-components/Card/LightCard';
import SearchInput from 'in-new-components/SearchInput';

import locals from './ScopeConfig.mless';

export default function ScopeConfig({ form, updateForm, QueryBuilderComponent }) {
  const { query, debouncedOnChange } = useDebouncedQuery();

  const applications = form.get('applications').value;
  const alertApplicationId = form.get('applicationId').value;
  const boundaryScope = form.get('boundaryScope').value;

  return (
    <LightCard
      title="Select Services/Endpoints"
      headerClassName={locals.header}
      header={<SearchInput className={locals.headerSearchInput} onChange={debouncedOnChange} query={query} />}
      withoutPadding
      darkFrame
      framed
    >
      <div className={locals.scopeConfigContainer}>
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
          searchQuery={query}
          isGlobalSmartAlert={false}
        />
        <div className={locals.spacer} />

        <AlertFilterConfigurator QueryBuilderComponent={QueryBuilderComponent} form={form} updateForm={updateForm} />
      </div>
    </LightCard>
  );
}

function useDebouncedQuery() {
  const [query, setQuery] = useState('');
  const { value, onChange: debouncedOnChange } = useDebouncedValue(
    query,
    value => {
      setQuery(value);
    },
    500
  );
  return { query: value, debouncedOnChange };
}
