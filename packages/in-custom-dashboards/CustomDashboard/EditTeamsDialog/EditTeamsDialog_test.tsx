/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { useObservable } from '@instana/hooks';

import EditTeamsDialog from 'in-custom-dashboards/CustomDashboard/EditTeamsDialog/EditTeamsDialog';
import { AccessRuleRelationType, AccessType } from 'in-types';
import { t } from 'in-i18n';

const testTeamsResult = {
  data: [
    {
      id: 'OiP5zdr6SCOeOC3j6e-xqw',
      name: 'vishnu-test-team',
      usersCount: 1,
      hasScope: false
    },
    {
      id: 'Cb9-JnITTB2ql9rW2uh7UA',
      name: 'desdy',
      usersCount: 0,
      hasScope: false
    },
    {
      id: 'qIZV7690SXeH9CxmNRlx4A',
      name: 'Andreas Test Team',
      usersCount: 1,
      hasScope: true
    },
    {
      id: 'ZKX0yJsHRyqXIpusmLanCA',
      name: 'Rose Test',
      usersCount: 2,
      hasScope: false
    },
    {
      id: 'NDD9l1KfRvy2OIDO650iOg',
      name: 'Rose Test team',
      usersCount: 2,
      hasScope: false
    },
    {
      id: 'juQhsVF0RX6p-RTbFSPY8w',
      name: 'our very first tag',
      usersCount: 1,
      hasScope: true
    },
    {
      id: '6mbRdxd9Qhm6YSwd-XHwpg',
      name: "Kyle's team",
      usersCount: 0,
      hasScope: false
    },
    {
      id: '4kQMMPMTTPeqSdDNZ373GA',
      name: 'Team Vishnu',
      usersCount: 3,
      hasScope: true
    },
    {
      id: 'PES9FYKJT-ChbqBWftn1fw',
      name: "Andre's Test Team",
      usersCount: 6,
      hasScope: true
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
jest.mock('@instana/hooks', () => ({
  useObservable: jest.fn()
}));
jest.mock('in-api/teams', () => {
  return {
    getTeamsOverview: jest.fn()
  };
});
jest.mock('in-services/featureFlags', () => ({
  rbacTeamsEnabled: true
}));

beforeEach(() => {
  (useObservable as jest.Mock).mockImplementation(() => testTeamsResult);
});

describe('EditTeamsDialog', () => {
  beforeEach(jest.clearAllMocks);
  const testConfig = {
    accessRules: [
      {
        accessType: 'READ_WRITE' as AccessType,
        relationType: 'USER' as AccessRuleRelationType,
        relatedId: '634ea36588656e0001bb53af'
      }
    ],
    id: 'nDyVFJvGQNWTOXvODaTaRQ',
    ownerId: '634ea36588656e0001bb53af',
    rbacTags: [
      {
        entity_id: 'nDyVFJvGQNWTOXvODaTaRQ',
        tag_id: 'juQhsVF0RX6p-RTbFSPY8w',
        displayName: 'our very first tag'
      },
      {
        entity_id: 'nDyVFJvGQNWTOXvODaTaRQ',
        tag_id: 'Cb9-JnITTB2ql9rW2uh7UA',
        displayName: 'desdy'
      }
    ],
    title: 'zippy',
    widgets: [
      {
        width: 1,
        x: 0,
        y: 0,
        id: 'XlWIGQ4558dpeb7x',
        title: '',
        type: 'markdown',
        config: 'Welcome folks',
        height: 1
      }
    ],
    writable: true
  };
  const onSubmit = jest.fn();
  const testComponent = <EditTeamsDialog config={testConfig} onSubmit={onSubmit} />;
  it('renders the dialog title', () => {
    render(testComponent);
    const title = screen.getByText(t('in-custom-dashboards:customDashboard.editTeamsDialog.title'));
    expect(title).toBeInTheDocument();
  });
  it('renders the drop down', () => {
    render(testComponent);
    const dropdown = screen.getByText(t('in-custom-dashboards:customDashboard.editTeamsDialog.chooseTeams'));
    expect(dropdown).toBeInTheDocument();
  });
  it('renders the correct teams when drop down is expanded', () => {
    const { container } = render(testComponent);
    const button = screen.getByRole('combobox');
    expect(button).toBeTruthy();
    fireEvent.click(button);
    let item = screen.getByText('desdy');
    expect(item).toBeInTheDocument();
    item = screen.getByText('our very first tag');
    expect(item).toBeInTheDocument();
    item = screen.getByText('Team Vishnu');
    expect(item).toBeInTheDocument();
    let checkboxes = container.querySelectorAll('.cds--checkbox');
    expect(checkboxes).toHaveLength(10);
    let checkedboxes = container.querySelectorAll('input:checked');
    expect(checkedboxes).toHaveLength(2);
  });
});
