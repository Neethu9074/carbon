/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render } from '@testing-library/react';
import { createMapForm } from 'formalistic';
import React from 'react';

import AdditionalPermissionSection from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/AdditionalPermissionSection/AdditionalPermissionSection';
import { applicationAdditionalCapabilities } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/constants';
import { t } from 'in-i18n';

describe('in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/AdditionalPermissionSection/AdditionalPermissionSection_test', () => {
  test('should render AdditionalPermissionSection for application section', () => {
    const { getByText } = render(
      <AdditionalPermissionSection
        form={createMapForm()}
        setForm={jest.fn()}
        capabilities={applicationAdditionalCapabilities}
      />
    );

    // Check that all labels are displayed
    expect(getByText(t('in-settings:productAreas.additionalPermissions'))).toBeVisible();
    expect(getByText(t('in-stores:permissionCanConfigureServiceMappingLabel'))).toBeVisible();
    expect(getByText(t('in-stores:permissionCanViewTraceDetailsLabel'))).toBeVisible();
  });
});
