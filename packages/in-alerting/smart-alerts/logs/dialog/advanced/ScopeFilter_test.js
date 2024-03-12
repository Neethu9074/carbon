/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import alertFormDefinition from 'in-alerting/smart-alerts/logs/form/alertFormDefinition';
import ScopeFilter from 'in-alerting/smart-alerts/logs/dialog/advanced/ScopeFilter';
import { alertConfig } from 'in-alerting/smart-alerts/logs/data/testData';
import { t } from 'in-i18n';

describe('ScopeFilter : in-alerting/smart-alerts/logs/dialog/advanced/ScopeFilter', () => {
  const form = alertFormDefinition(alertConfig, false);
  const updateForm = jest.fn();
  it('should render correctly', () => {
    render(<ScopeFilter form={form} updateForm={updateForm} />);
    expect(screen.getByText(t('in-components:queryBuilder.workspaceTitleFilter'))).toBeInTheDocument();
  });

  it('should call `updateForm` when the tag filter expression Clears', () => {
    render(<ScopeFilter form={form} updateForm={updateForm} />);
    expect(screen.getAllByRole('button')).toBeTruthy();
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(updateForm).toHaveBeenCalled();
  });
});
