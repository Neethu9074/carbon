/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createField, createMapForm } from 'formalistic';
import { render, screen } from '@testing-library/react';
import React from 'react';

import ContributionFilterWrapper from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/components/ApplicationContributionFilter/ContributionFilterWrapper';
import { contributionFilterNameValidator } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Groups/Group.form';
import { t } from 'in-i18n';

const mockFormData = {
  id: 'jqNSMP8vT7a4giHqIlwzqw',
  name: 'test_group',
  label: 'test_group_filter',
  members: [
    {
      userId: '64e47335fcc73b0001b87dd0',
      email: 'rosemaria.antony@ibm.com',
      joinedViaIdpMapping: false
    }
  ],
  permissionSet: {
    permissions: [
      'CAN_VIEW_LOGS',
      'LIMITED_WEBSITES_SCOPE',
      'CAN_VIEW_TRACE_DETAILS',
      'LIMITED_MOBILE_APPS_SCOPE',
      'ACCESS_MOBILE_APPS',
      'CAN_CONFIGURE_APPLICATIONS',
      'LIMITED_APPLICATIONS_SCOPE',
      'ACCESS_APPLICATIONS'
    ],
    kubernetesClusterUUIDs: [],
    kubernetesNamespaceUIDs: [],
    websiteIds: [],
    mobileAppIds: [
      {
        scopeId: '4vzOR2zuSKuNjV-D5I_c3g',
        scopeRoleId: '-1'
      }
    ],
    syntheticTestIds: [],
    restrictedApplicationFilter: null,
    infraDfqFilter: {
      scopeId: '',
      scopeRoleId: '-1'
    },
    applicationIds: [
      {
        scopeId: 'tWfV-BLqSLK3QHPkNelr7Q',
        scopeRoleId: '-100'
      },
      {
        scopeId: '1qvXgVfLTNqi8gGTcCaNUw',
        scopeRoleId: '-101'
      },
      {
        scopeId: 'HI73c60kS32GANJz44dfIw',
        scopeRoleId: '-102'
      }
    ]
  },
  scope: 'INCLUDE_IMMEDIATE_DOWNSTREAM_DATABASE_AND_MESSAGING',
  tagFilterExpression: [
    {
      type: 'TAG_FILTER',
      name: 'call.bpm.process.business.key',
      operator: 'EQUALS',
      value: 'load_gen'
    }
  ],
  actionFilter: { scopeId: undefined, scopeRoleId: '-1' }
};

export const createFilterForm = () => {
  const { id, name, label, members, permissionSet, scope, tagFilterExpression } = { ...mockFormData };

  return createMapForm()
    .put(
      'id',
      createField({
        value: id
      })
    )
    .put(
      'name',
      createField({
        value: name
      })
    )
    .put(
      'label',
      createField({
        value: label,
        validator: contributionFilterNameValidator
      })
    )
    .put(
      'members',
      createField({
        value: members
      })
    )
    .put(
      'permissionSet',
      createField({
        value: permissionSet
      })
    )
    .put(
      'scope',
      createField({
        value: scope
      })
    )
    .put(
      'tagFilterExpression',
      createField({
        value: tagFilterExpression
      })
    );
};

describe('in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/components/ApplicationContributionFilter/ContributionFilterWrapper', () => {
  test('should render ContributionFilterWrapper', () => {
    render(<ContributionFilterWrapper form={createFilterForm()} setForm={jest.fn()} />);
    expect(screen.getByText(t('in-settings:PermissionSection.contribution_filter'))).toBeInTheDocument();
    expect(screen.getByText(t('in-settings:PermissionSection.contributionFilter_downstreamCalls'))).toBeInTheDocument();
  });
});
