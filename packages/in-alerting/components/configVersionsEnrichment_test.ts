/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

/* eslint-env jest */

import { extendAlertConfigVersions } from './configVersionsEnrichment';
import { AuthorType, ChangeType } from 'in-types';
import { t } from 'in-i18n';

jest.mock('in-i18n', () => ({ t: jest.fn() }));

describe('in-alerting/components/configVersionsEnrichment::extendAlertConfigVersions', () => {
  const newAlertConfigVersions = [
    {
      id: 'TMS_EISKQzSAAsBk5qjq7Q',
      created: 1626796474219,
      enabled: true,
      deleted: false,
      ...getChangeSummary('DELETE', 'Alfred. E. Neumann')
    },
    {
      id: 'TMS_EISKQzSAAsBk5qjq7Q',
      created: 1626793047094,
      enabled: true,
      deleted: false,
      ...getChangeSummary('RESTORE', 'D. Snyder')
    },
    {
      id: 'TMS_EISKQzSAAsBk5qjq7Q',
      created: 1626732000000,
      enabled: true,
      deleted: false,
      ...getChangeSummary('ENABLE', 'Lemmy Kilmister')
    },
    {
      id: 'TMS_EISKQzSAAsBk5qjq7Q',
      created: 1626645600000,
      enabled: true,
      deleted: false,
      ...getChangeSummary('DISABLE', 'Erna')
    },
    {
      id: 'TMS_EISKQzSAAsBk5qjq7Q',
      created: 1626472800000,
      enabled: true,
      deleted: false,
      ...getChangeSummary('UPDATE', 'Fabolous Mr. Fox')
    },
    {
      id: 'TMS_EISKQzSAAsBk5qjq7Q',
      created: 1626300000000,
      enabled: true,
      deleted: false,
      ...getChangeSummary('CREATE', 'Nina Hagen')
    }
  ];

  const oldAlertConfigVersions = [
    {
      id: 'TMS_EISKQzSAAsBk5qjq7Q',
      created: 1626796474219,
      enabled: true,
      deleted: false,
      ...getChangeSummary('UNKNOWN', undefined, undefined, 'UNKNOWN')
    },

    {
      id: 'TMS_EISKQzSAAsBk5qjq7Q',
      created: 1626793047094,
      enabled: true,
      deleted: false,
      ...getChangeSummary('UNKNOWN', undefined, undefined, 'UNKNOWN')
    }
  ];

  const mixedAlertConfigVersions = [
    {
      id: 'TMS_EISKQzSAAsBk5qjq7Q',
      created: 1626472800000,
      enabled: true,
      deleted: false,
      ...getChangeSummary('UPDATE', 'Fabolous Mr. Fox')
    },
    {
      id: 'TMS_EISKQzSAAsBk5qjq7Q',
      created: 1626796474219,
      enabled: true,
      deleted: false,
      ...getChangeSummary('UNKNOWN', undefined, undefined, 'UNKNOWN')
    },
    {
      id: 'TMS_EISKQzSAAsBk5qjq7Q',
      created: 1626793047094,
      enabled: true,
      deleted: false,
      ...getChangeSummary('UNKNOWN', undefined, undefined, 'UNKNOWN')
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('it should count revisions correctly for NEW configs', () => {
    extendAlertConfigVersions(newAlertConfigVersions);
    expect(t).toHaveBeenNthCalledWith(5, 'in-alerting:components.revisionDropdownButton.restore', { alertRevision: 2 });
  });

  test('it should count revisions correctly for OLD configs', () => {
    extendAlertConfigVersions(oldAlertConfigVersions);
    expect(t).toHaveBeenLastCalledWith('in-alerting:components.revisionDropdownButton.revision', {
      alertRevision: 2
    });
  });

  test('it should count revisions correctly for MIXED configs', () => {
    extendAlertConfigVersions(mixedAlertConfigVersions);
    expect(t).toHaveBeenLastCalledWith('in-alerting:components.revisionDropdownButton.revision', {
      alertRevision: 3
    });
  });

  test('it uses correct icon type for changeType UNKNOWN for NEW configs', () => {
    const versions = extendAlertConfigVersions([
      {
        id: 'TMS_EISKQzSAAsBk5qjq7Q',
        created: 1626300000000,
        enabled: true,
        deleted: false,
        ...getChangeSummary('UNKNOWN', 'Nina Hagen')
      }
    ]);

    expect(versions[0].iconType).toBeUndefined();
  });

  test('it uses correct icon type for changeType UNKNOWN for MIXED configs', () => {
    const versions = extendAlertConfigVersions([
      {
        id: 'TMS_EISKQzSAAsBk5qjq7Q',
        created: 1626300000000,
        enabled: true,
        deleted: false,
        ...getChangeSummary('CREATE', 'Nina Hagen')
      },
      {
        id: 'TMS_EISKQzSAAsBk5qjq7Q',
        created: 1626793047094,
        enabled: true,
        deleted: false,
        ...getChangeSummary('UNKNOWN', undefined, undefined, 'UNKNOWN')
      }
    ]);
    expect(versions[1].iconType).toEqual('lib_actions_edit');
  });

  test('it should still maintain the correct order after enhancing AlertConfigVersions', () => {
    const versions = extendAlertConfigVersions(newAlertConfigVersions);
    expect(versions[0].created).toEqual(newAlertConfigVersions[0].created);
    expect(versions[versions.length - 1].created).toEqual(
      newAlertConfigVersions[newAlertConfigVersions.length - 1].created
    );
  });

  test('disabled and paused state should have a "disabled: true" property added ', () => {
    const versions = extendAlertConfigVersions(newAlertConfigVersions);
    expect(versions[1].disabled).toBeUndefined();
    expect(versions[2].disabled).toEqual(true);
    expect(versions[3].disabled).toEqual(true);
    expect(versions[versions.length - 1].created).toEqual(
      newAlertConfigVersions[newAlertConfigVersions.length - 1].created
    );
  });
});

function getChangeSummary(changeType: ChangeType, authorFullName?: string, authorId?: string, authorType?: AuthorType) {
  return {
    changeSummary: {
      changeType,
      author: {
        id: authorId,
        type: authorType,
        fullName: authorFullName
      }
    }
  };
}
