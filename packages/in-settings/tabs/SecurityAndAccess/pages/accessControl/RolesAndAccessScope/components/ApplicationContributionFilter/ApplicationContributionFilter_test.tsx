/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { render, screen } from '@testing-library/react';
import { act } from '@testing-library/react-hooks/dom';
import { Field } from 'formalistic';
import React from 'react';

import ApplicationContributionFilter from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/components/ApplicationContributionFilter/ApplicationContributionFilter';
import { createFilterForm } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/components/ApplicationContributionFilter/ContributionFilterWrapper_test';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { t } from 'in-i18n';

// Mock CreateApplicationQueryBuilder as it prevents jest from shutting down properly
jest.mock('in-applications/creation/components/CreateApplicationQueryBuilder', () => {
  return {
    __esModule: true,
    default: jest.fn(() => <div />)
  };
});

jest.mock('in-settings/tabs/SecurityAndAccess/api/groups', () => {
  const { success } = jest.requireActual('in-services/util/result');
  const { just } = jest.requireActual('@instana/observables');
  return {
    __esModule: true,
    contributionFilterNameExists: jest.fn(name =>
      just(success({ exists: name === 'test_group_filter_already_exists' }))
    )
  };
});

const DEBOUNCE_DELAY = 500;

describe('in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/components/ApplicationContributionFilter/ApplicationContributionFilter', () => {
  // Mock timers (for debounce)
  jest.useFakeTimers();

  test('should render ApplicationContributionFilter', () => {
    render(<ApplicationContributionFilter form={createFilterForm()} setForm={jest.fn()} />);
    expect(screen.getByText(t('in-settings:PermissionSection.contributionFilter_downstreamCalls'))).toBeInTheDocument();
    expect(screen.getByText(t('in-applications:creation.advanced.clear'))).toBeInTheDocument();
    expect(screen.getByText(t('in-settings:PermissionSection.contributionFilter_name'))).toBeInTheDocument();
  });

  test('should hide clear button if no filter applied', () => {
    const form = createFilterForm().updateIn(['tagFilterExpression'], f =>
      (f as Field<FormModelElement[]>).setValue([])
    );
    render(<ApplicationContributionFilter form={form} setForm={jest.fn()} />);
    expect(screen.queryByText(t('in-applications:creation.advanced.clear'))).not.toBeInTheDocument();
  });

  test('should report vaild with valid data', async () => {
    await act(async () => {
      const setValid = jest.fn();
      const { getByText, queryByText } = render(
        <ApplicationContributionFilter form={createFilterForm()} setForm={jest.fn()} setValid={setValid} />
      );
      expect(getByText(t('in-settings:PermissionSection.contributionFilter_name'))).toBeInTheDocument();
      jest.advanceTimersByTime(DEBOUNCE_DELAY);
      // Should report valid
      expect(setValid).toHaveBeenCalledWith(true);

      // No validation errors shown
      expect(
        await queryByText(t('in-settings:PermissionSection.contributionFilter_name_mayNotBeBlank'))
      ).not.toBeInTheDocument();
      expect(
        await queryByText(t('in-settings:PermissionSection.contributionFilter_name_mustNotBeLargerThan128Characters'))
      ).not.toBeInTheDocument();
      expect(
        await queryByText(t('in-settings:PermissionSection.contributionFilter_name_alreadyUsed'))
      ).not.toBeInTheDocument();
    });
  });

  test('should show validation error for empty filter name', async () => {
    const form = createFilterForm().updateIn(['label'], f => (f as Field<string>).setValue('').setTouched(true));
    const setValid = jest.fn();

    const { getByText, findByText } = render(
      <ApplicationContributionFilter form={form} setForm={jest.fn()} setValid={setValid} />
    );
    expect(getByText(t('in-settings:PermissionSection.contributionFilter_name'))).toBeInTheDocument();
    // Should report invalid
    expect(setValid).toHaveBeenCalledWith(false);
    // Validation error is shown
    expect(await findByText(t('in-settings:PermissionSection.contributionFilter_name_mayNotBeBlank'))).toBeVisible();
  });

  test('should show validation error for too long filter name', async () => {
    const form = createFilterForm().updateIn(['label'], f =>
      (f as Field<string>)
        .setValue(
          'This is a name that is way too long (more than 128 characters) for an application perspective name and therefore cannot be used for that purpose'
        )
        .setTouched(true)
    );
    const setValid = jest.fn();

    const { getByText, findByText } = render(
      <ApplicationContributionFilter form={form} setForm={jest.fn()} setValid={setValid} />
    );
    expect(getByText(t('in-settings:PermissionSection.contributionFilter_name'))).toBeInTheDocument();
    // Should report invalid
    expect(setValid).toHaveBeenCalledWith(false);
    // Validation error is shown
    expect(
      await findByText(t('in-settings:PermissionSection.contributionFilter_name_mustNotBeLargerThan128Characters'))
    ).toBeVisible();
  });

  test('should show validation error for already used filter/application name', async () => {
    const form = createFilterForm().updateIn(['label'], f =>
      (f as Field<string>).setValue('test_group_filter_already_exists').setTouched(true)
    );
    const setValid = jest.fn();

    await act(async () => {
      const { getByText, findByText } = render(
        <ApplicationContributionFilter form={form} setForm={jest.fn()} setValid={setValid} />
      );
      expect(getByText(t('in-settings:PermissionSection.contributionFilter_name'))).toBeInTheDocument();
      jest.advanceTimersByTime(DEBOUNCE_DELAY);
      // Should report invalid
      expect(setValid).toHaveBeenCalledWith(false);

      // Validation error is shown
      expect(await findByText(t('in-settings:PermissionSection.contributionFilter_name_alreadyUsed'))).toBeVisible();
    });
  });
});
