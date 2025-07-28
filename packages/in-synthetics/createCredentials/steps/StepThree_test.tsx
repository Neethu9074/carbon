/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import { useObservable } from '@instana/hooks';

import createCredentialForm from 'in-synthetics/createCredentials/createCredentialForm';
import StepThree from 'in-synthetics/createCredentials/steps/StepThree';
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

beforeEach(() => {
  (useObservable as jest.Mock).mockImplementation(() => testTeamsResult);
});
describe(StepThree, () => {
  const updateForm = jest.fn();

  it('should render without crashing', () => {
    render(<StepThree form={createCredentialForm([])} updateForm={updateForm} />);
  });

  it('should display Associations section correctly', () => {
    render(<StepThree form={createCredentialForm([])} updateForm={updateForm} />);

    expect(screen.getByText(t('in-synthetics:dialog.createCredential.steps.teamsStepDescription'))).toBeInTheDocument();
    expect(screen.getByText(t('in-settings:tabs.chooseTeams'))).toBeTruthy();

    expect(screen.getByRole('combobox', { name: 'Teams' })).toBeInTheDocument();
  });
});
