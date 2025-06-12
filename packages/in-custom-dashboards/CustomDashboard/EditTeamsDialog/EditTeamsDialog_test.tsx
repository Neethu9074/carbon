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
      id: 'R3kiM5t5RX65blmGPo9lng',
      displayName: "Fabienne's team"
    },
    {
      id: 'qIZV7690SXeH9CxmNRlx4A',
      displayName: 'Andreas Test Team'
    },
    {
      id: 'GfldyEDUTiqSZtr28EC53A',
      displayName: 'Philips team'
    },
    {
      id: 'iYtsNMPpShiyRkPF4trkUQ',
      displayName: 'Mate test'
    },
    {
      id: 'hSgNzPdzQn-kH16-U4trCw',
      displayName: 'Sample team'
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
        tag_id: 'hSgNzPdzQn-kH16-U4trCw',
        displayName: 'Sample team'
      },
      {
        entity_id: 'nDyVFJvGQNWTOXvODaTaRQ',
        tag_id: 'iYtsNMPpShiyRkPF4trkUQ',
        displayName: 'Mate test'
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
  it('renders the correct teams when drop down is expanded', async () => {
    const { container } = render(testComponent);
    const button = screen.getByRole('combobox');
    expect(button).toBeTruthy();
    fireEvent.click(button);
    let item = screen.getByText('Philips team');
    expect(item).toBeInTheDocument();
    item = screen.getByText('Mate test');
    expect(item).toBeInTheDocument();
    item = screen.getByText('Sample team');
    expect(item).toBeInTheDocument();
    let checkboxes = container.querySelectorAll('.cds--checkbox');
    expect(checkboxes).toHaveLength(5);
    let checkedboxes = container.querySelectorAll('input:checked');
    expect(checkedboxes).toHaveLength(2);

    const saveBtn = screen.getByText(t('in-custom-dashboards:save'));
    fireEvent.click(saveBtn);
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});
