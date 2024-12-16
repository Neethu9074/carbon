/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { render } from '@testing-library/react';
import { noop } from 'lodash';
import React from 'react';

import AlertHeader from 'in-alerting/components/AlertHeader';

describe('in-alerting/components/AlertHeader', () => {
  it('shows only one message for a deleted config.', () => {
    // GIVEN
    const alertConfigVersions = [
      {
        id: 'dFiQJk8tQ-Gh3VgFYTOmaQ',
        created: 333,
        enabled: true,
        deleted: true,
        changeSummary: {
          changeType: 'DELETE',
          author: {
            id: '5ee8a3e8cd70020001ecb007',
            type: 'USER',
            fullName: 'Stan'
          }
        }
      },
      {
        id: 'dFiQJk8tQ-Gh3VgFYTOmaQ',
        created: 222,
        enabled: true,
        deleted: false,
        changeSummary: {
          changeType: 'UPDATE',
          author: {
            id: '5ee8a3e8cd70020001ecb007',
            type: 'USER',
            fullName: 'Stan'
          }
        }
      },
      {
        id: 'dFiQJk8tQ-Gh3VgFYTOmaQ',
        created: 111,
        enabled: true,
        deleted: false,
        changeSummary: {
          changeType: 'CREATE',
          author: {
            id: '5ee8a3e8cd70020001ecb007',
            type: 'USER',
            fullName: 'Stan'
          }
        }
      }
    ];

    // WHEN
    const { container } = render(
      <AlertHeader
        {...getSharedProps()}
        alertConfig={{
          created: 333,
          readOnly: true,
          enabled: true
        }}
        alertConfigVersions={alertConfigVersions}
      />
    );

    // THEN
    const messages = container.querySelectorAll('.carbon-message');
    expect(messages.length).toBe(1);
    expect(messages[0]).toHaveTextContent('deleted');
  });

  it('shows only one message for viewing an older revision of config.', () => {
    // GIVEN
    const alertConfigVersions = [
      {
        id: 'dFiQJk8tQ-Gh3VgFYTOmaQ',
        created: 333,
        enabled: true,
        deleted: false,
        changeSummary: {
          changeType: 'UPDATE',
          author: {
            id: '5ee8a3e8cd70020001ecb007',
            type: 'USER',
            fullName: 'Stan'
          }
        }
      },
      {
        id: 'dFiQJk8tQ-Gh3VgFYTOmaQ',
        created: 222,
        enabled: true,
        deleted: false,
        changeSummary: {
          changeType: 'UPDATE',
          author: {
            id: '5ee8a3e8cd70020001ecb007',
            type: 'USER',
            fullName: 'Stan'
          }
        }
      },
      {
        id: 'dFiQJk8tQ-Gh3VgFYTOmaQ',
        created: 111,
        enabled: true,
        deleted: false,
        changeSummary: {
          changeType: 'CREATE',
          author: {
            id: '5ee8a3e8cd70020001ecb007',
            type: 'USER',
            fullName: 'Stan'
          }
        }
      }
    ];

    // WHEN
    const { container } = render(
      <AlertHeader
        {...getSharedProps()}
        alertConfig={{
          created: 222,
          readOnly: true,
          enabled: true
        }}
        alertConfigVersions={alertConfigVersions}
      />
    );

    // THEN
    const messages = container.querySelectorAll('.carbon-message');
    expect(messages.length).toBe(1);
    expect(messages[0]).toHaveTextContent('Revision 1 ');
  });
});

function getSharedProps() {
  return {
    setRevision: noop,
    openDialog: noop,
    fullyQualifiedAlertsList: 'fullyQualifiedAlertsList_path',
    doEnableConfig$: noop,
    doDisableConfig$: noop,
    doDeleteConfig$: noop,
    doRestoreConfig$: noop
  };
}
