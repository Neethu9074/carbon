/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { render, screen } from '@testing-library/react';
import { Field } from 'formalistic';
import React from 'react';

import { createFilterForm } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/LimitingApplicationFilter/LimitingApplicationFilterWrapper_test';
import LimitingApplicationFilter from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/LimitingApplicationFilter/LimitingApplicationFilter';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { t } from 'in-i18n';

describe('in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/LimitingApplicationFilter/LimitingApplicationFilter', () => {
  test('should render LimitingApplicationFilter', () => {
    render(<LimitingApplicationFilter form={createFilterForm()} setForm={jest.fn()} />);
    expect(screen.getByText(t('in-settings:PermissionSection.limitation_downstreamCalls'))).toBeInTheDocument();
    expect(screen.getByText(t('in-applications:creation.advanced.clear'))).toBeInTheDocument();
  });

  test('should hide clear button if no filter applied', () => {
    const form = createFilterForm().updateIn(['tagFilterExpression'], f =>
      (f as Field<FormModelElement[]>).setValue([])
    );
    render(<LimitingApplicationFilter form={form} setForm={jest.fn()} />);
    expect(screen.queryByText(t('in-applications:creation.advanced.clear'))).not.toBeInTheDocument();
  });
});
