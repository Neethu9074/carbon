/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { render, screen } from '@testing-library/react';
import { Field } from 'formalistic';
import React from 'react';

import ApplicationContributionFilter from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/ApplicationContributionFilter/ApplicationContributionFilter';
import { createFilterForm } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/ApplicationContributionFilter/ContributionFilterWrapper_test';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { t } from 'in-i18n';

describe('in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/ApplicationContributionFilter/ApplicationContributionFilter', () => {
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
});
