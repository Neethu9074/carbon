/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { fireEvent, render, waitFor } from '@testing-library/react';
import ResizeObserver from 'resize-observer-polyfill';
import userEvent from '@testing-library/user-event';
import React from 'react';

import RoleMappingTearsheet from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/RoleMapping/RoleMappingTearsheet';
import { useRolesSelectOptions } from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/hooks/useRolesSelectOptions';
import { useTeamsSelectOptions } from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/hooks/useTeamsSelectOptions';
import { getMappingRuleById, saveMapping } from 'in-settings/tabs/SecurityAndAccess/api/groupMappings';
import { ENTERPRISE_IDP_MAPPING_SUBMIT } from 'in-services/tracking/eventNames';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { successObservable } from 'in-services/util/result';
import { CREATED_OBJECT } from 'in-services/util/constants';
import { t } from 'in-i18n';

global.ResizeObserver = ResizeObserver;

jest.mock('in-services/tracking/useSegmentTracking', () => ({
  useSegmentTracking: jest.fn().mockReturnValue({
    unstable_trackEvent: jest.fn()
  })
}));

jest.mock('in-settings/tabs/SecurityAndAccess/pages/identityProviders/hooks/useTeamsSelectOptions', () => ({
  useTeamsSelectOptions: jest.fn()
}));

jest.mock('in-settings/tabs/SecurityAndAccess/pages/identityProviders/hooks/useRolesSelectOptions', () => ({
  useRolesSelectOptions: jest.fn()
}));

jest.mock('in-settings/tabs/SecurityAndAccess/api/groupMappings');

describe('in-settings/tabs/SecurityAndAccess/pages/identityProviders/RoleMapping/RoleMappingTearsheet.tsx', () => {
  beforeEach(() => {
    (useRolesSelectOptions as jest.Mock).mockReturnValue({
      roleOptions: [{ id: '6PYmj11xSrKV', name: 'Admin' }],
      selectedRole: { id: '', name: 'Select' },
      rolesLoading: false,
      rolesError: null
    });

    (useTeamsSelectOptions as jest.Mock).mockReturnValue({
      teamOptions: [{ id: 'PlQFmI1srZt8sJIw', displayName: 'Application team' }],
      selectedTeam: { id: 'PlQFmI1srZt8sJIw', displayName: 'Application team' },
      teamsLoading: false,
      teamsError: null
    });
  });

  it('should display edit mapping rule tearsheet', () => {
    // Given
    const roleMapping = {
      id: 'c83fa1xBTb6y7',
      key: 'testkey',
      value: 'testval',
      groupId: '6PYmj11xSrKV',
      teamId: 'PlQFmI1srZt8sJIw'
    };
    (getMappingRuleById as jest.Mock).mockReturnValue(successObservable(roleMapping));
    const setMessage = jest.fn();

    // When
    const { getByText, getByLabelText } = render(
      <RoleMappingTearsheet roleMappingId={roleMapping.id} setMessage={setMessage} />
    );

    // Then
    expect(getByText(t('in-settings:tabs.roleMapping.mappingRuleTitle_edit'))).toBeInTheDocument();
    expect(getByLabelText(t('in-settings:tabs.roleMapping.keyColumn'))).toHaveValue(roleMapping.key);
    expect(getByLabelText(t('in-settings:tabs.roleMapping.valueColumn'))).toHaveValue(roleMapping.value);
    expect(getByText(t('in-settings:tabs.roleMapping.roleColumn'))).toBeInTheDocument();
    expect(getByText(t('in-settings:tabs.roleMapping.teamOptional'))).toBeInTheDocument();
    expect(getByText(t('forms.actions.save'))).toBeInTheDocument();
  });
  it('should display create mapping rule tearsheet', () => {
    // Given
    const setMessage = jest.fn();

    // When
    const { getByText } = render(<RoleMappingTearsheet setMessage={setMessage} />);

    // Then
    expect(getByText(t('in-settings:tabs.roleMapping.mappingRuleTitle'))).toBeInTheDocument();
    expect(getByText(t('forms.actions.create'))).toBeInTheDocument();
  });
  it('submits the form and shows success message', async () => {
    // Given
    const roleMapping = {
      id: 'c83fa1xBTb6y7',
      key: 'newKey',
      value: 'newVal',
      groupId: '6PYmj11xSrKV'
    };
    const setMessage = jest.fn();
    (saveMapping as jest.Mock).mockReturnValue(successObservable(roleMapping));

    // When
    const { getByRole, getByLabelText, findByText } = render(<RoleMappingTearsheet setMessage={setMessage} />);

    // Simulate user input
    fireEvent.change(getByLabelText(t('in-settings:tabs.roleMapping.keyColumn')), {
      target: { value: roleMapping.key }
    });
    fireEvent.change(getByLabelText(t('in-settings:tabs.roleMapping.valueColumn')), {
      target: { value: roleMapping.value }
    });
    fireEvent.click(getByRole('combobox', { name: t('in-settings:tabs.roleMapping.roleColumn') }));
    const item = await findByText('Admin');
    fireEvent.click(item);

    // Simulate submit button click
    userEvent.click(getByRole('button', { name: t('forms.actions.create') }));

    // Wait for the form submission to complete and check if the success message is called
    await waitFor(() => {
      expect(setMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          kind: 'success',
          title: t('in-settings:components.successTitle'),
          subtitle: t('in-settings:tabs.roleMapping.mappingRuleMessage')
        })
      );
    });

    // Check if tracking event was triggered
    expect(useSegmentTracking().unstable_trackEvent).toHaveBeenCalledWith(
      CREATED_OBJECT,
      { objectType: ENTERPRISE_IDP_MAPPING_SUBMIT },
      { teamSelected: false }
    );
  });
});
