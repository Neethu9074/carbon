/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Field } from 'formalistic';
import React from 'react';

import AlertConfigTearSheetStep1 from 'in-alerting/smart-alerts/synthetics/tearsheet/steps/AlertConfigTearSheetStep1';
import alertFormDefinition from 'in-alerting/smart-alerts/synthetics/form/alertDialogFormDefinition';
import { initialConfig } from 'in-alerting/smart-alerts/synthetics/data/alertConfig.json';
import { t } from 'in-i18n';

// Mock the dependencies
jest.mock('in-alerting/smart-alerts/synthetics/components/AlertQueryBuilder', () => ({
  createBoundedAlertQueryBuilder: jest.fn(() => ({
    QueryBuilder: () => <div data-testid="mock-alert-query-builder">Alert Query Builder</div>,
    isQueryValid: jest.fn(() => true)
  })),
  createIsAlertQueryValid: jest.fn(() => jest.fn(() => true))
}));

jest.mock('in-alerting/smart-alerts/synthetics/hooks/useIsTagFilterFormModelValid', () => ({
  useIsTagFilterFormModelValid: jest.fn((tagFilterExpression, isAlertQueryValid) => true)
}));

jest.mock('in-alerting/smart-alerts/components/dialog/ClearTagFilterExpressionButton', () => ({
  ClearTagFilterExpressionButton: () => <button data-testid="clear-tag-filter-button">Clear Tag Filter</button>
}));

jest.mock('in-alerting/smart-alerts/synthetics/tearsheet/components/ConfigureAlertTest', () => {
  return jest.fn(() => <div data-testid="configure-alert-test">Configure Alert Test</div>);
});

// Mock the form object
jest.mock('in-alerting/smart-alerts/synthetics/form/alertDialogFormDefinition', () => {
  return jest.fn().mockImplementation(config => ({
    toJS: jest.fn().mockReturnValue(config),
    get: jest.fn().mockImplementation(path => {
      if (path === 'tagFilterExpression') {
        return { value: config.tagFilterExpression?.elements?.length > 0 ? 'non-empty' : '' };
      }
      return { value: '' };
    })
  }));
});

describe('AlertConfigTearSheetStep1 : in-alerting/smart-alerts/synthetics/tearsheet/steps/AlertConfigTearSheetStep1', () => {
  const onChange = jest.fn();
  const updateForm = jest.fn();
  const setTagFilterValid = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render step 1 components', async () => {
    const form = alertFormDefinition(initialConfig);

    render(
      <AlertConfigTearSheetStep1
        form={form}
        updateForm={updateForm}
        onChange={onChange}
        setTagFilterValid={setTagFilterValid}
      />
    );

    // Check for title and description
    expect(screen.getByText(t('in-alerting:smartAlerts.synthetics.tearSheet.step1.header'))).toBeInTheDocument();
    expect(screen.getByText(t('in-alerting:smartAlerts.synthetics.tearSheet.step1.description'))).toBeInTheDocument();

    // Check for filter section
    expect(screen.getByText(t('in-alerting:smartAlerts.synthetics.tearSheet.scopeFilter.filter'))).toBeInTheDocument();
    expect(
      screen.getByText(t('in-alerting:smartAlerts.synthetics.tearSheet.scopeFilter.filterDescription'))
    ).toBeInTheDocument();

    // Check for ConfigureAlertTest component
    expect(screen.getByTestId('configure-alert-test')).toBeInTheDocument();

    // Check for AlertQueryBuilder component
    expect(screen.getByTestId('mock-alert-query-builder')).toBeInTheDocument();
  });

  it('should call setTagFilterValid when component mounts', async () => {
    const form = alertFormDefinition(initialConfig);

    render(
      <AlertConfigTearSheetStep1
        form={form}
        updateForm={updateForm}
        onChange={onChange}
        setTagFilterValid={setTagFilterValid}
      />
    );

    // The useEffect should call setTagFilterValid on mount
    expect(setTagFilterValid).toHaveBeenCalledWith(true);
  });

  it('should not show clear button when tag filter expression is empty', () => {
    const emptyConfig = {
      ...initialConfig,
      tagFilterExpression: { type: 'EXPRESSION', logicalOperator: 'AND', elements: [] }
    };

    const form = alertFormDefinition(emptyConfig);

    render(
      <AlertConfigTearSheetStep1
        form={form}
        updateForm={updateForm}
        onChange={onChange}
        setTagFilterValid={setTagFilterValid}
      />
    );

    // Clear button should not be visible
    expect(screen.queryByTestId('clear-tag-filter-button')).not.toBeInTheDocument();
  });

  it('should show clear button when tag filter expression is not empty', () => {
    const configWithFilter = {
      ...initialConfig,
      tagFilterExpression: {
        type: 'EXPRESSION',
        logicalOperator: 'AND',
        elements: [{ type: 'TAG_FILTER', key: 'test', operator: 'EQUALS', value: 'value' }]
      }
    };

    const form = alertFormDefinition(configWithFilter);

    render(
      <AlertConfigTearSheetStep1
        form={form}
        updateForm={updateForm}
        onChange={onChange}
        setTagFilterValid={setTagFilterValid}
      />
    );

    // Clear button should be visible
    expect(screen.getByTestId('clear-tag-filter-button')).toBeInTheDocument();
  });

  it('should update tag filter validity when dependencies change', async () => {
    const {
      useIsTagFilterFormModelValid
    } = require('in-alerting/smart-alerts/synthetics/hooks/useIsTagFilterFormModelValid');

    // First render with valid filter
    useIsTagFilterFormModelValid.mockReturnValue(true);

    const form = alertFormDefinition(initialConfig);

    const { rerender } = render(
      <AlertConfigTearSheetStep1
        form={form}
        updateForm={updateForm}
        onChange={onChange}
        setTagFilterValid={setTagFilterValid}
      />
    );

    expect(setTagFilterValid).toHaveBeenCalledWith(true);

    // Re-render with invalid filter
    setTagFilterValid.mockClear();
    useIsTagFilterFormModelValid.mockReturnValue(false);

    rerender(
      <AlertConfigTearSheetStep1
        form={form}
        updateForm={updateForm}
        onChange={onChange}
        setTagFilterValid={setTagFilterValid}
      />
    );

    expect(setTagFilterValid).toHaveBeenCalledWith(false);
  });
});

// Made with Bob
