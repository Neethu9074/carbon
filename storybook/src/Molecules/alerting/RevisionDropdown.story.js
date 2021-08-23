/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import { extendAlertConfigVersions } from 'in-alerting/components/configVersionsEnrichment';
import RevisionDropdown from 'in-alerting/components/RevisionDropdown';
import { getRevision } from 'in-alerting/components/AlertHeader';

export default {
  title: 'Molecules|alerting/RevisionDropdown',
  component: RevisionDropdown
};

export const RevisionDropdownNewConfigs = () => {
  const [alertConfig, setAlertConfig] = useState(newVersioningFormatData.alertConfig);

  const alertConfigVersions = extendAlertConfigVersions(newVersioningFormatData.alertConfigVersions);
  const alertRevision = getRevision(alertConfig, alertConfigVersions);

  return (
    <RevisionDropdown
      alertConfigVersions={alertConfigVersions}
      alertRevision={alertRevision}
      setRevision={created => {
        setAlertConfig(newVersioningFormatData.alertConfigVersions.find(acv => acv.created === created));
      }}
    />
  );
};

export const RevisionDropdownOldConfigs = () => {
  const [alertConfig, setAlertConfig] = useState(oldVersioningFormatData.alertConfig);

  const alertConfigVersions = extendAlertConfigVersions(oldVersioningFormatData.alertConfigVersions);
  const alertRevision = getRevision(alertConfig, alertConfigVersions);

  return (
    <RevisionDropdown
      alertConfigVersions={alertConfigVersions}
      alertRevision={alertRevision}
      setRevision={created => {
        setAlertConfig(oldVersioningFormatData.alertConfigVersions.find(acv => acv.created === created));
      }}
    />
  );
};

export const RevisionDropdownMixedConfigs = () => {
  const [alertConfig, setAlertConfig] = useState(mixedVersioningFormatData.alertConfig);

  const alertConfigVersions = extendAlertConfigVersions(mixedVersioningFormatData.alertConfigVersions);
  const alertRevision = getRevision(alertConfig, alertConfigVersions);

  return (
    <RevisionDropdown
      alertConfigVersions={alertConfigVersions}
      alertRevision={alertRevision}
      setRevision={created => {
        setAlertConfig(mixedVersioningFormatData.alertConfigVersions.find(acv => acv.created === created));
      }}
    />
  );
};

const newVersioningFormatData = {
  alertConfig: {
    id: 'TMS_EISKQzSAAsBk5qjq7Q',
    created: 1626796474219,
    readOnly: false,
    enabled: true,
    ...getChangeSummary('UPDATE', 'Foo man chu')
  },
  alertConfigVersions: [
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
      ...getChangeSummary('ENABLE', 'D. Snyder')
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
      created: 1626559200000,
      enabled: true,
      deleted: false,
      ...getChangeSummary(
        'UPDATE',
        'Very Long Name Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo '
      )
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
      created: 1626386400000,
      enabled: true,
      deleted: false,
      ...getChangeSummary('UPDATE', 'Lemmy Kilmister')
    },
    {
      id: 'TMS_EISKQzSAAsBk5qjq7Q',
      created: 1626300000000,
      enabled: true,
      deleted: false,
      ...getChangeSummary('CREATE', 'Nina Hagen')
    }
  ],
  alertRevision: 2
};

const oldVersioningFormatData = {
  alertConfig: {
    id: 'TMS_EISKQzSAAsBk5qjq7Q',
    created: 1626796474219,
    readOnly: false,
    enabled: true
  },
  alertConfigVersions: [
    {
      id: 'TMS_EISKQzSAAsBk5qjq7Q',
      created: 1626796474219,
      enabled: true,
      deleted: false,
      changeSummary: {
        changeType: 'UNKNOWN',
        author: {
          type: 'UNKNOWN'
        }
      }
    },
    {
      id: 'TMS_EISKQzSAAsBk5qjq7Q',
      created: 1626793047094,
      enabled: true,
      deleted: false,
      changeSummary: {
        changeType: 'UNKNOWN',
        author: {
          type: 'UNKNOWN'
        }
      }
    },
    {
      id: 'TMS_EISKQzSAAsBk5qjq7Q',
      created: 1626732000000,
      enabled: true,
      deleted: false,
      changeSummary: {
        changeType: 'UNKNOWN',
        author: {
          type: 'UNKNOWN'
        }
      }
    },
    {
      id: 'TMS_EISKQzSAAsBk5qjq7Q',
      created: 1626645600000,
      enabled: true,
      deleted: false,
      changeSummary: {
        changeType: 'UNKNOWN',
        author: {
          type: 'UNKNOWN'
        }
      }
    },
    {
      id: 'TMS_EISKQzSAAsBk5qjq7Q',
      created: 1626559200000,
      enabled: true,
      deleted: false,
      changeSummary: {
        changeType: 'UNKNOWN',
        author: {
          type: 'UNKNOWN'
        }
      }
    },
    {
      id: 'TMS_EISKQzSAAsBk5qjq7Q',
      created: 1626472800000,
      enabled: true,
      deleted: false,
      changeSummary: {
        changeType: 'UNKNOWN',
        author: {
          type: 'UNKNOWN'
        }
      }
    },
    {
      id: 'TMS_EISKQzSAAsBk5qjq7Q',
      created: 1626386400000,
      enabled: true,
      deleted: false,
      changeSummary: {
        changeType: 'UNKNOWN',
        author: {
          type: 'UNKNOWN'
        }
      }
    },
    {
      id: 'TMS_EISKQzSAAsBk5qjq7Q',
      created: 1626300000000,
      enabled: true,
      deleted: false,
      changeSummary: {
        changeType: 'UNKNOWN',
        author: {
          type: 'UNKNOWN'
        }
      }
    }
  ],
  alertRevision: 2
};

const mixedVersioningFormatData = {
  alertConfig: {
    id: 'TMS_EISKQzSAAsBk5qjq7Q',
    created: 1626796474219,
    readOnly: false,
    enabled: true
  },
  alertConfigVersions: [
    ...newVersioningFormatData.alertConfigVersions.slice(0, 4),
    ...oldVersioningFormatData.alertConfigVersions.slice(-4)
  ],
  alertRevision: 2
};

function getChangeSummary(changeType, authorFullName, authorId = null, authorType = null) {
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
