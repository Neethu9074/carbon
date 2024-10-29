/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

/* eslint-env jest */

import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import { create } from '@instana/observables';

import {
  getIdpRestriction,
  getMappings,
  setMappings,
  setIdpRestriction,
  IdentityProviderPatch,
  IdpGroupMapping
} from 'in-settings/tabs/SecurityAndAccess/api/groupMappings';
// @ts-expect-error
import { getConfigAsResultObservableNotMemoized as ldapConfig } from 'in-settings/tabs/SecurityAndAccess/api/ldap';
// @ts-expect-error
import { getConfigAsResultObservable as oidcConfig } from 'in-settings/tabs/SecurityAndAccess/api/oidc';
// @ts-expect-error
import { getConfigAsResultObservable as samlConfig } from 'in-settings/tabs/SecurityAndAccess/api/saml';
import GroupMapping from 'in-settings/tabs/SecurityAndAccess/pages/indentityProviders/GroupMapping/GroupMapping';
import { getGroupsAsResultObservable } from 'in-settings/tabs/SecurityAndAccess/api/groups';
import { t } from 'in-i18n';

jest.mock('in-settings/tabs/SecurityAndAccess/api/groupMappings');
jest.mock('in-settings/tabs/SecurityAndAccess/api/groups');
jest.mock('in-settings/tabs/SecurityAndAccess/api/saml');
jest.mock('in-settings/tabs/SecurityAndAccess/api/ldap');
jest.mock('in-settings/tabs/SecurityAndAccess/api/oidc');

function getLoadedResult(data: any) {
  return {
    progress: {
      loading: false
    },
    errors: [],
    data
  };
}

const setIdpsAvailability = (value: any) => {
  const saml = create();
  saml.emit(getLoadedResult({ activated: value }));
  (samlConfig as jest.Mock).mockReturnValue(saml);

  const oidc = create();
  oidc.emit(getLoadedResult({ activated: value }));
  (oidcConfig as jest.Mock).mockReturnValue(oidc);

  const ldap = create();
  ldap.emit(getLoadedResult({ url: value ? 'ldap://ldap.foo.com' : null }));
  (ldapConfig as jest.Mock).mockReturnValue(ldap);
};

const setMappingsFromServer = (value: any) => {
  const obs = create();
  obs.emit(value);
  (getMappings as jest.Mock).mockReturnValue(obs);
};

const setIdpFromServer = (value: any) => {
  const obs = create();
  obs.emit(value);
  (getIdpRestriction as jest.Mock).mockReturnValue(obs);
};

const setGroupsFromServer = (value: any) => {
  const obs = create();
  obs.emit(value);
  (getGroupsAsResultObservable as jest.Mock).mockReturnValue(obs);
};

enum IdpMappingField {
  Key = 1,
  Value,
  GroupId
}

describe('in-settings/tabs/SecurityAndAccess/pages/indentityProviders/GroupMapping/GroupMapping', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('If there are mappings, show them', async () => {
    setMappingsFromServer(getLoadedResult([{ key: 'Akey', value: 'AValue', groupId: 'InstaGroupA' }]));

    setGroupsFromServer(
      getLoadedResult([
        { id: 'GroupId', name: 'Insta Group Default' },
        { id: 'InstaGroupA', name: 'Instana Group A' }
      ])
    );

    setIdpFromServer(
      getLoadedResult({
        restrictEmptyIdpGroups: false
      })
    );

    setIdpsAvailability(true);

    render(<GroupMapping />);

    expect(screen.getByDisplayValue('Akey')).toBeInTheDocument();
    expect(screen.getByDisplayValue('AValue')).toBeInTheDocument();
    expect((screen.getByText('Instana Group A') as HTMLOptionElement).selected).toBeTruthy();
    expect((screen.getByText('Insta Group Default') as HTMLOptionElement).selected).toBeFalsy();
  });

  it('Edit one new row, click on save', async () => {
    const fakeSetMappings = setMappings as jest.Mock;
    fakeSetMappings.mockImplementation(() => ({
      once: (anotherObservable: any) => {
        anotherObservable();
      }
    }));

    const fakeSetIdp = setIdpRestriction as jest.Mock;
    fakeSetIdp.mockImplementation(() => ({ once: () => {} }));

    setMappingsFromServer(getLoadedResult([{ id: 'ABC', key: 'Akey', value: 'AValue', groupId: 'InstaGroupA' }]));

    setIdpsAvailability(true);

    setGroupsFromServer(
      getLoadedResult([
        { id: 'InstaGroupA', name: 'Instana Group A' },
        { id: 'InstaGroupB', name: 'Instana Group B' },
        { id: 'InstaGroupC', name: 'Instana Group C' }
      ])
    );

    setIdpFromServer(
      getLoadedResult({
        restrictEmptyIdpGroups: false
      })
    );

    const groupMappingScreen = render(<GroupMapping />);

    setKeyAt(1, 'MyNewKey');
    setValueAt(1, 'MyNewValue');
    setGroupIdAt(1, 'InstaGroupB');

    const saveButton = groupMappingScreen.getByText(t('forms.actions.save'));
    clickOn(saveButton);

    expect(fakeSetMappings).toHaveBeenLastCalledWith([
      { groupId: 'InstaGroupB', key: 'MyNewKey', value: 'MyNewValue', id: 'ABC' } as IdpGroupMapping
    ]);

    expect(fakeSetIdp).toHaveBeenLastCalledWith({ restrictEmptyIdpGroups: false } as IdentityProviderPatch);
  });

  it('Add one new row, click on save', async () => {
    const fakeSetMappings = setMappings as jest.Mock;
    fakeSetMappings.mockImplementation(() => ({
      once: (anotherObservable: any) => {
        anotherObservable();
      }
    }));

    setMappingsFromServer(getLoadedResult([{ id: 'ABC', key: 'Akey', value: 'AValue', groupId: 'InstaGroupA' }]));

    setIdpsAvailability(true);

    setGroupsFromServer(
      getLoadedResult([
        { id: 'InstaGroupA', name: 'Instana Group A' },
        { id: 'InstaGroupB', name: 'Instana Group B' },
        { id: 'InstaGroupC', name: 'Instana Group C' }
      ])
    );

    setIdpFromServer(
      getLoadedResult({
        restrictEmptyIdpGroups: false
      })
    );

    const groupMappingScreen = render(<GroupMapping />);

    const addRowButton = groupMappingScreen.getByText(t('in-settings:tabs.addGroupMapping'));
    clickOn(addRowButton);

    setKeyAt(1, 'MyNewKey');
    setValueAt(1, 'MyNewValue');
    setGroupIdAt(1, 'InstaGroupC');

    const saveButton = groupMappingScreen.getByText(t('forms.actions.save'));
    clickOn(saveButton);

    expect(fakeSetMappings).toHaveBeenLastCalledWith([
      { id: null, groupId: 'InstaGroupC', key: 'MyNewKey', value: 'MyNewValue' },
      { id: 'ABC', groupId: 'InstaGroupA', key: 'Akey', value: 'AValue' }
    ]);
  });

  it('Delete one row, click on save', async () => {
    const fakeSetMappings = setMappings as jest.Mock;
    fakeSetMappings.mockImplementation(() => ({ once: () => {} }));

    setMappingsFromServer(
      getLoadedResult([
        { key: 'Akey', value: 'AValue', groupId: 'InstaGroupA' },
        { key: 'Bkey', value: 'BValue', groupId: 'InstaGroupB' }
      ])
    );

    setIdpFromServer(
      getLoadedResult({
        restrictEmptyIdpGroups: false
      })
    );

    setGroupsFromServer(
      getLoadedResult([
        { id: 'InstaGroupA', name: 'Instana Group A' },
        { id: 'InstaGroupB', name: 'Instana Group B' },
        { id: 'InstaGroupC', name: 'Instana Group C' }
      ])
    );

    const groupMappingScreen = render(<GroupMapping />);

    const selector = `table > tbody > tr:nth-child(1) > td:nth-child(4) svg`;
    const deleteButton = document.querySelector(selector);
    clickOn(deleteButton);

    const saveButton = groupMappingScreen.getByText(t('forms.actions.save'));
    clickOn(saveButton);

    expect(fakeSetMappings).toHaveBeenLastCalledWith([{ groupId: 'InstaGroupB', key: 'Bkey', value: 'BValue' }]);
  });

  it('Does not allow saving if deny is checked and there are no groups', async () => {
    const fakeSetMappings = setMappings as jest.Mock;
    fakeSetMappings.mockImplementation(() => ({ once: () => {} }));

    setMappingsFromServer(getLoadedResult([{ key: 'Akey', value: 'AValue', groupId: 'InstaGroupA' }]));

    setIdpsAvailability(true);

    setGroupsFromServer(
      getLoadedResult([
        { id: 'InstaGroupA', name: 'Instana Group A' },
        { id: 'InstaGroupB', name: 'Instana Group B' },
        { id: 'InstaGroupC', name: 'Instana Group C' }
      ])
    );

    setIdpFromServer(
      getLoadedResult({
        restrictEmptyIdpGroups: false
      })
    );

    render(<GroupMapping />);

    const denyCheckBox = screen.getByLabelText(t('in-settings:tabs.denyUserWithNoGroup'));
    clickOn(denyCheckBox);

    expect(screen.queryByText(t('in-settings:tabs.thereShouldBeAtLeastOneGroupMapping'))).not.toBeInTheDocument();

    const selector = `table > tbody > tr:nth-child(1) > td:nth-child(4) svg`;
    const deleteButton = document.querySelector(selector);
    clickOn(deleteButton);

    expect(screen.getByText(t('in-settings:tabs.thereShouldBeAtLeastOneGroupMapping'))).toBeInTheDocument();

    expect(screen.getByText(t('forms.actions.save'))).toHaveClass('button-disabled');
  });

  it('Does not allow anything without idp', async () => {
    const fakeSetMappings = setMappings as jest.Mock;
    fakeSetMappings.mockImplementation(() => ({ once: () => {} }));

    setMappingsFromServer(getLoadedResult([]));

    setIdpsAvailability(false);

    setGroupsFromServer(getLoadedResult([]));

    setIdpFromServer(
      getLoadedResult({
        restrictEmptyIdpGroups: false
      })
    );

    render(<GroupMapping />);

    expect(screen.getByText(t('in-settings:tabs.failIfNoIdp'))).toBeInTheDocument();
  });

  function setKeyAt(row: number, value: string) {
    setAt(row, IdpMappingField.Key, value);
  }

  function setValueAt(row: number, value: string) {
    setAt(row, IdpMappingField.Value, value);
  }

  function setGroupIdAt(row: number, value: string) {
    setAt(row, IdpMappingField.GroupId, value);
  }

  function setAt(row: number, field: IdpMappingField, value: string) {
    const type = field === IdpMappingField.GroupId ? 'select' : 'input';
    const selector = `table > tbody > tr:nth-child(${row}) > td:nth-child(${field}) ${type}`;
    const input = document.querySelector(selector);
    if (!input) {
      fail(`Could not find ${selector}`);
    }
    fireEvent.change(input, { target: { value: value } });
  }

  function clickOn(element: any) {
    fireEvent(
      element,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true
      })
    );
  }
});
