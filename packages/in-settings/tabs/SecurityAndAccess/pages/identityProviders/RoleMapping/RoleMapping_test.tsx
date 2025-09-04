/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { fireEvent, render } from '@testing-library/react';
import React from 'react';

import { just } from '@instana/observables';

import {
  getMappingsOverview,
  getMappingRuleById,
  setIdpRestriction,
  deleteMapping,
  getIdpRestriction
} from 'in-settings/tabs/SecurityAndAccess/api/groupMappings';
import RoleMappingTearsheet from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/RoleMapping/RoleMappingTearsheet';
import RoleMapping from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/RoleMapping/RoleMapping';
import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import useAuthOverview from 'in-settings/hooks/useAuthOverview';
import { success } from 'in-services/util/result';
import { t } from 'in-i18n';

// Mock all the required dependencies for testing
jest.mock('in-settings/tabs/SecurityAndAccess/api/groupMappings');
jest.mock('in-settings/hooks/useAuthOverview');
jest.mock('in-components/DialogPresenter/store');
jest.mock('in-settings/tabs/SecurityAndAccess/pages/identityProviders/RoleMapping/RoleMappingTearsheet');

describe('in-settings/tabs/SecurityAndAccess/pages/identityProviders/RoleMapping/RoleMapping', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('does not allow create mapping rules without idp', async () => {
    // Given
    // Mock the authentication overview to simulate a scenario where no identity provider is active
    (useAuthOverview as jest.Mock).mockReturnValue(
      resultToFetchedStateResponse(
        success({
          defaultLogin: true,
          sso: 'DISABLED',
          saml: 'AVAILABLE',
          oidc: 'AVAILABLE',
          ldap: 'AVAILABLE'
        })
      )
    );

    // When
    const { getByText, queryByText } = render(<RoleMapping />);
    // Look for the disabled description text that should appear when no IdP is active
    // Only checking for substring as there are hyperlinks in the message
    const roleMappingDisabledDescription = getByText(
      t('in-settings:tabs.roleMapping.roleMappingDisabledDescription').substring(0, 150),
      {
        exact: false
      }
    );
    // Try to find the "Create Mapping Rule" button which should not exist in this state
    const createMappingRuleButton = queryByText(t('in-settings:tabs.roleMapping.newMappingRule'));

    // Then
    // Verify that the disabled description is shown
    expect(roleMappingDisabledDescription).toBeTruthy();
    // Verify that the create mapping rule button is not present
    expect(createMappingRuleButton).toBeFalsy();
  });

  it('does allow create mapping rules with idp enabled', async () => {
    // Given
    // Mock the authentication overview to simulate a scenario where SAML identity provider is active
    (useAuthOverview as jest.Mock).mockReturnValue(
      resultToFetchedStateResponse(
        success({
          defaultLogin: false,
          sso: 'DISABLED',
          saml: 'ACTIVE',
          oidc: 'AVAILABLE',
          ldap: 'AVAILABLE'
        })
      )
    );
    // Mock an empty list of mapping rules
    (getMappingsOverview as jest.Mock).mockReturnValue(just(success([])));
    // Mock the IdP restriction setting to be false (not restricting empty IdP groups)
    (getIdpRestriction as jest.Mock).mockReturnValue(just(success({ restrictEmptyIdpGroups: false })));

    // When
    const { getByText, getByLabelText } = render(<RoleMapping />);
    // Look for the regular role mapping description that should appear when an IdP is active
    // Only checking for substring as there are hyperlinks in the message
    const roleMappingDescription = getByText(t('in-settings:tabs.roleMapping.description').substring(0, 100), {
      exact: false
    });
    // Find the "Create Mapping Rule" button which should exist in this state
    const createMappingRuleButton = getByText(
      t('in-settings:tabs.roleMapping.newMappingRule', undefined, { timeout: 1000 })
    );
    // Find the "Deny Access" checkbox that controls the restrictEmptyIdpGroups setting
    const denyAccessCheckBox = getByLabelText(t('in-settings:tabs.roleMapping.restrictEmptyIdpRolesLabel'));

    // Then
    // Verify that the regular description is shown
    expect(roleMappingDescription).toBeTruthy();
    // Verify that the create mapping rule button is present
    expect(createMappingRuleButton).toBeTruthy();
    // Verify that the deny access checkbox is disabled (because there are no mapping rules yet)
    expect(denyAccessCheckBox).toHaveAttribute('disabled');
  });

  it('does allow setting deny access if one mapping rule exists', async () => {
    // Given
    // Mock the authentication overview to simulate a scenario where SAML identity provider is active
    (useAuthOverview as jest.Mock).mockReturnValue(
      resultToFetchedStateResponse(
        success({
          defaultLogin: false,
          sso: 'DISABLED',
          saml: 'ACTIVE',
          oidc: 'AVAILABLE',
          ldap: 'AVAILABLE'
        })
      )
    );
    // Mock a list with one mapping rule
    (getMappingsOverview as jest.Mock).mockReturnValue(
      just(
        success([{ id: 's0WHGsz_Rouaihh_NVan3Q', key: 'memberOf', role: 'Admin', team: 'A-Team', value: 'Hannibal' }])
      )
    );
    // Mock the IdP restriction setting to be false initially
    (getIdpRestriction as jest.Mock).mockReturnValue(just(success({ restrictEmptyIdpGroups: false })));
    // Mock the setIdpRestriction function to simulate successful setting update
    (setIdpRestriction as jest.Mock).mockImplementation(() => {
      return {
        once: () => success({})
      };
    });

    // When
    const { getByText, getByLabelText, getAllByTestId, queryByText } = render(<RoleMapping />);
    const roleMappingDescription = getByText(t('in-settings:tabs.roleMapping.description').substring(0, 100), {
      exact: false
    });
    const createMappingRuleButton = getByText(
      t('in-settings:tabs.roleMapping.newMappingRule', undefined, { timeout: 1000 })
    );
    // Find the "Deny Access" checkbox
    const denyAccessCheckBox = getByLabelText(t('in-settings:tabs.roleMapping.restrictEmptyIdpRolesLabel'));
    expect(denyAccessCheckBox).toBeInTheDocument();

    // Verify that the mapping rule data is displayed in the table
    const selectCell = getByLabelText('Select row');
    const keyCell = getByText('memberOf');
    const roleCell = getByText('Admin');
    const teamCell = getByText('A-Team');
    const valueCell = getByText('Hannibal');

    // Simulate clicking the "Deny Access" checkbox to enable the restriction
    fireEvent.click(denyAccessCheckBox);

    // Simulate clicking select row checkbox in the table
    fireEvent.click(selectCell);

    // Get the edit and delete icons from the table row
    const editIcon = getAllByTestId('editIcon')[0];
    const deleteIcon = getAllByTestId('deleteIcon')[0];

    // Batch delete button from the table
    const batchDeleteButton = queryByText('Delete');

    // Then
    // Verify that the regular description and create button are shown
    expect(roleMappingDescription).toBeTruthy();
    expect(createMappingRuleButton).toBeTruthy();

    // Verify that all mapping rule data is displayed correctly
    expect(keyCell).toBeTruthy();
    expect(roleCell).toBeTruthy();
    expect(teamCell).toBeTruthy();
    expect(valueCell).toBeTruthy();

    // Verify that the deny access checkbox is enabled (because there is at least one mapping rule)
    expect(denyAccessCheckBox).not.toHaveAttribute('disabled');

    // Verify that the edit icon is not disabled (editing should be allowed even with deny access enabled)
    expect(editIcon).not.toHaveAttribute('disabled');

    // Verify that the delete icon is disabled (cannot delete the last mapping rule when deny access is enabled)
    expect(deleteIcon).toHaveAttribute('disabled');

    // Verify the the batch delete button does not exist
    expect(batchDeleteButton).toBeFalsy();
  });

  it('should open create mapping rule dialog when clicking the create button', async () => {
    // Given
    // Mock the authentication overview with SAML active
    (useAuthOverview as jest.Mock).mockReturnValue(
      resultToFetchedStateResponse(
        success({
          defaultLogin: false,
          sso: 'DISABLED',
          saml: 'ACTIVE',
          oidc: 'AVAILABLE',
          ldap: 'AVAILABLE'
        })
      )
    );
    // Mock a list with one existing mapping rule
    (getMappingsOverview as jest.Mock).mockReturnValue(
      just(
        success([{ id: 's0WHGsz_Rouaihh_NVan3Q', key: 'memberOf', role: 'Admin', team: 'A-Team', value: 'Hannibal' }])
      )
    );
    // Mock the IdP restriction setting
    (getIdpRestriction as jest.Mock).mockReturnValue(just(success({ restrictEmptyIdpGroups: false })));

    // Mock the dialog that gets added
    (addActiveDialog as jest.Mock).mockImplementation();

    // When
    // Render the component and find the create mapping rule button
    const { getByText } = render(<RoleMapping />);
    const createMappingRuleButton = getByText(t('in-settings:tabs.roleMapping.newMappingRule'));

    // Simulate clicking the create button
    fireEvent.click(createMappingRuleButton);

    // Then
    // Verify that the dialog presenter was called to show the create mapping dialog
    expect(addActiveDialog).toHaveBeenCalled();
  });

  it('should open edit mapping rule dialog when clicking the edit icon', async () => {
    // Given
    // Mock the authentication overview with SAML active
    (useAuthOverview as jest.Mock).mockReturnValue(
      resultToFetchedStateResponse(
        success({
          defaultLogin: false,
          sso: 'DISABLED',
          saml: 'ACTIVE',
          oidc: 'AVAILABLE',
          ldap: 'AVAILABLE'
        })
      )
    );
    // Define the mapping rule that will be used in the test
    const mappingRule = {
      id: 's0WHGsz_Rouaihh_NVan3Q',
      key: 'memberOf',
      role: 'Admin',
      team: 'A-Team',
      value: 'Hannibal'
    };

    // Mock a list with one existing mapping rule
    (getMappingsOverview as jest.Mock).mockReturnValue(just(success([mappingRule])));
    // Mock the IdP restriction setting
    (getIdpRestriction as jest.Mock).mockReturnValue(just(success({ restrictEmptyIdpGroups: false })));

    // Mock the getMappingRuleById function to return the mapping rule
    (getMappingRuleById as jest.Mock).mockReturnValue(just(success(mappingRule)));

    // Create a mock implementation for RoleMappingTearsheet
    (RoleMappingTearsheet as jest.Mock).mockReturnValue(null);

    // Mock the addActiveDialog function to simulate adding a dialog
    (addActiveDialog as jest.Mock).mockImplementation();

    // When
    const { getAllByTestId } = render(<RoleMapping />);
    // Get the edit icon from the table row
    const editIcon = getAllByTestId('editIcon')[0];

    // Simulate clicking the edit icon
    fireEvent.click(editIcon);

    // Then
    // Verify that the dialog presenter was called
    expect(addActiveDialog).toHaveBeenCalled();

    // Get the dialog component that was passed to addActiveDialog
    const createMappingRuleDialog = (addActiveDialog as jest.Mock).mock.calls[0][0];

    // Verify the dialog component props contains mapping rule id
    expect(createMappingRuleDialog.props).toEqual(
      expect.objectContaining({
        roleMappingId: mappingRule.id
      })
    );
  });

  it('should delete a mapping rule when clicking the delete icon', async () => {
    // Given
    // Mock the authentication overview with SAML active
    (useAuthOverview as jest.Mock).mockReturnValue(
      resultToFetchedStateResponse(
        success({
          defaultLogin: false,
          sso: 'DISABLED',
          saml: 'ACTIVE',
          oidc: 'AVAILABLE',
          ldap: 'AVAILABLE'
        })
      )
    );
    // Mock a list with two mapping rules, ordered alphabetically by key
    // 'group' comes before 'memberOf' alphabetically, so the first entry will be the one with key 'group'
    const mappingRules = [
      { id: 'b1XYZabc_Def456_GHIjk7L', key: 'group', role: 'User', team: 'B-Team', value: 'User Group' },
      { id: 's0WHGsz_Rouaihh_NVan3Q', key: 'memberOf', role: 'Admin', team: 'A-Team', value: 'Hannibal' }
    ];
    (getMappingsOverview as jest.Mock).mockReturnValue(just(success(mappingRules)));
    (getIdpRestriction as jest.Mock).mockReturnValue(just(success({ restrictEmptyIdpGroups: false })));

    // Mock the deleteMapping function to return a successful response
    (deleteMapping as jest.Mock).mockImplementation(() => just(success({})));

    // Mock the addActiveDialog function to simulate the confirmation dialog
    // This mock automatically triggers the onSubmit action as if the user confirmed the deletion
    (addActiveDialog as jest.Mock).mockImplementation(dialog => {
      // Extract the onSubmit function from the dialog props
      const onSubmit = dialog.props.onSubmit;
      // Call onSubmit to simulate clicking the confirm button
      onSubmit();
    });

    // When
    const { getAllByTestId, getAllByLabelText, queryByText } = render(<RoleMapping />);
    const deleteIcons = getAllByTestId('deleteIcon');
    const selectCells = getAllByLabelText('Select row');
    expect(deleteIcons.length).toBe(2);

    // Simulate clicking the delete icon for the first mapping rule (with key 'group')
    fireEvent.click(deleteIcons[0]);

    // Simulate clicking select row checkbox in the table
    fireEvent.click(selectCells[0]);

    // Batch delete button from the table
    const batchDeleteButton = queryByText('Delete');

    // Then
    // Verify that the confirmation dialog was shown
    expect(addActiveDialog).toHaveBeenCalled();

    // Verify that the dialog was closed after confirmation
    expect(close).toHaveBeenCalled();

    // Verify that the deleteMapping API was called with the correct mapping rule ID
    expect(deleteMapping).toHaveBeenCalledWith('b1XYZabc_Def456_GHIjk7L');

    // Verify the the batch delete button does exist
    expect(batchDeleteButton).toBeTruthy();
  });
});
