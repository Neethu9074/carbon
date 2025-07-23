/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import { useObservable } from '@instana/hooks';

import { TeamsSelection } from 'in-bizops/lists/businessPerspectives/components/TeamsSelection';

const testTeamsResult = {
  data: [
    {
      id: 'OiP5zdr6SCOeOC3j6e-xqw',
      name: 'vishnu-test-team',
      usersCount: 1,
      hasScope: false
    },
    {
      id: 'VkIOoe81QlGdcpfF09v46w',
      name: 'czhang-team2',
      usersCount: 0,
      hasScope: false
    },
    {
      id: '0nAtCz8JT6WO_UFcQJ4aXw',
      name: 'aTeam',
      usersCount: 0,
      hasScope: false
    },
    {
      id: 'NDD9l1KfRvy2OIDO650iOg',
      name: 'Rose Test team',
      usersCount: 2,
      hasScope: false
    },
    {
      id: 'bvhM4OyeRfWEjR7_AA6h2Q',
      name: 'SRE CIO',
      usersCount: 0,
      hasScope: false
    }
  ],
  errors: [],
  progress: {
    loading: false
  },
  time: 1747675225549
};

const testTeamsResultLoading = {
  data: [],
  errors: [],
  progress: {
    loading: true
  },
  time: 1747675225549
};

const testTeamsResultErrors = {
  data: [],
  errors: ['this is bad'],
  progress: {
    loading: false
  },
  time: 1747675225549
};

jest.mock('@instana/hooks', () => ({
  useObservable: jest.fn()
}));
jest.mock('in-api/teams', () => {
  return {
    getTeamsOverview: jest.fn()
  };
});

global.ResizeObserver = class MockedResizeObserver {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
};

describe('TeamsSelection', () => {
  beforeEach(jest.clearAllMocks);
  it('renders without crashing', () => {
    const testComponent = <TeamsSelection selectedTeams={[]} onChange={() => {}} />;
    render(testComponent);
  });
});

describe('TeamsSelection', () => {
  beforeEach(jest.clearAllMocks);
  beforeEach(() => {
    (useObservable as jest.Mock).mockImplementation(() => testTeamsResult);
  });

  it('displays the correctly for selected teams', () => {
    const teams = ['aTeam', 'SRE CIO'];
    const testComponent = <TeamsSelection selectedTeams={teams} onChange={() => {}} />;
    const { container } = render(testComponent);
    let tags = container.querySelectorAll('.cds--tag__label');
    expect(tags).toHaveLength(6);
    const buttonExpandElement = screen.getByRole('combobox');
    expect(buttonExpandElement).toBeTruthy();
    fireEvent.click(buttonExpandElement);
    let checkboxes = container.querySelectorAll('.cds--checkbox');
    expect(checkboxes).toHaveLength(5);
    let checkedBoxes = container.querySelectorAll('input:checked');
    expect(checkedBoxes).toHaveLength(2);
    const button = screen.getByRole('button', { name: 'Clear all selected items' });
    expect(button).toBeTruthy();
    fireEvent.click(button);
    tags = container.querySelectorAll('.cds--tag__label');
    expect(tags).toHaveLength(5);
  });

  it('displays the correctly for empty selected teams', () => {
    const testComponent = <TeamsSelection selectedTeams={[]} onChange={() => {}} />;
    const { container } = render(testComponent);
    let tags = container.querySelectorAll('.cds--tag__label');
    expect(tags).toHaveLength(1);
    const buttonExpandElement = screen.getByRole('combobox');
    expect(buttonExpandElement).toBeTruthy();
    fireEvent.click(buttonExpandElement);
    let checkboxes = container.querySelectorAll('.cds--checkbox');
    expect(checkboxes).toHaveLength(5);
    let checkedBoxes = container.querySelectorAll('input:checked');
    expect(checkedBoxes).toHaveLength(0);
  });
});

describe('TeamsSelection', () => {
  beforeEach(jest.clearAllMocks);
  beforeEach(() => {
    (useObservable as jest.Mock).mockImplementation(() => testTeamsResultLoading);
  });

  it('displays the correctly for loading', () => {
    const testComponent = <TeamsSelection selectedTeams={[]} onChange={() => {}} />;
    const { container } = render(testComponent);
    let tags = container.querySelectorAll('.cds--inline-loading');
    expect(tags).toHaveLength(1);
  });
});

describe('TeamsSelection', () => {
  beforeEach(jest.clearAllMocks);
  beforeEach(() => {
    (useObservable as jest.Mock).mockImplementation(() => testTeamsResultErrors);
  });

  it('displays the correctly for errors', () => {
    const testComponent = <TeamsSelection selectedTeams={[]} onChange={() => {}} />;
    const { container } = render(testComponent);
    let tags = container.querySelectorAll('.cds--inline-notification--error');
    expect(tags).toHaveLength(1);
  });
});
