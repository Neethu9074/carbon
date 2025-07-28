/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { fireEvent, render, screen } from '@testing-library/react';
import { createField, createMapForm } from 'formalistic';
import React from 'react';

import { useObservable } from '@instana/hooks';

import TeamsStep, { SYNTHETIC_TAB } from 'in-synthetics/createTests/wizard/TeamsStep';
import { t } from 'in-i18n';

const testTeamsResult = {
  data: [
    {
      id: 'OiP5zdr6SCOeOC3j6e-xqw',
      displayName: 'vishnu-test-team'
    },
    {
      id: 'VkIOoe81QlGdcpfF09v46w',
      displayName: 'czhang-team2'
    },
    {
      id: '0nAtCz8JT6WO_UFcQJ4aXw',
      displayName: 'aTeam'
    },
    {
      id: 'NDD9l1KfRvy2OIDO650iOg',
      displayName: 'Rose Test team'
    },
    {
      id: 'bvhM4OyeRfWEjR7_AA6h2Q',
      displayName: 'SRE CIO'
    }
  ],
  errors: [],
  progress: {
    loading: false
  },
  time: 1747675225549
};
jest.mock('@instana/hooks', () => ({
  useObservable: jest.fn()
}));
jest.mock('in-settings/tabs/SecurityAndAccess/api/tags', () => {
  return {
    getTagsResult: jest.fn()
  };
});
jest.mock('in-services/featureFlags', () => ({
  rbacTeamsEnabled: true
}));

beforeEach(() => {
  (useObservable as jest.Mock).mockImplementation(() => testTeamsResult);
});

describe('TeamsStep', () => {
  beforeEach(jest.clearAllMocks);
  const selectedTeams = [
    {
      id: '0nAtCz8JT6WO_UFcQJ4aXw',
      displayName: 'aTeam'
    },
    {
      id: 'VkIOoe81QlGdcpfF09v46w',
      displayName: 'czhang-team2'
    }
  ];
  const form = createMapForm().put(
    'rbacTags',
    createField({
      value: selectedTeams
    })
  );

  const updateForm = jest.fn();
  const testComponent = <TeamsStep form={form} updateForm={updateForm} tab={SYNTHETIC_TAB.TESTS} />;
  it('renders the callout message', () => {
    render(testComponent);
    const title = screen.getByText(
      t('in-synthetics:dialog.createTest.advancedMode.teamsCalloutMessage', { syntheticTab: SYNTHETIC_TAB.TESTS })
    );
    expect(title).toBeInTheDocument();
  });
  it('renders the drop down', () => {
    render(testComponent);
    const dropdown = screen.getByText(t('in-settings:tabs.chooseTeams'));
    expect(dropdown).toBeInTheDocument();
  });
  it('renders the correct teams when drop down is expanded', () => {
    const { container } = render(testComponent);
    const button = screen.getByRole('combobox');
    expect(button).toBeTruthy();
    fireEvent.click(button);
    let item = screen.getByText('czhang-team2');
    expect(item).toBeInTheDocument();
    item = screen.getByText('aTeam');
    expect(item).toBeInTheDocument();
    let checkboxes = container.querySelectorAll('.cds--checkbox');
    expect(checkboxes).toHaveLength(5);
    let checkedboxes = container.querySelectorAll('input:checked');
    expect(checkedboxes).toHaveLength(2);
  });
});
