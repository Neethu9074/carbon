/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import alertFormDefinition from 'in-alerting/smart-alerts/infrastructure/form/alertFormDefinition';
import { alertConfig, tagCatalog } from 'in-alerting/smart-alerts/infrastructure/data/testData';
import ScopeSection from 'in-alerting/smart-alerts/infrastructure/dialog/advanced/ScopeSection';
import { t } from 'in-i18n';

describe('Render ScopeSection in infra SA dialog : in-alerting/smart-alerts/infrastructure/dialog/advanced/ScopeSection', () => {
  const form = alertFormDefinition(alertConfig, false);
  const updateForm = jest.fn();
  const onChange = jest.fn();
  const setTagFilter = jest.fn();

  it('renders ScopeSection component', () => {
    render(
      <ScopeSection
        form={form}
        updateForm={updateForm}
        tagCatalog={tagCatalog}
        onChange={onChange}
        setTagFilterValid={setTagFilter}
        isRegex={false}
      />
    );

    expect(
      screen.getByText(t('in-custom-dashboards:widgets.srcInfrastructure.metricsFormComponent.crossSeriesAggregation'))
    ).toBeInTheDocument();
  });
});
