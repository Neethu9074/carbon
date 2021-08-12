/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import RevisionDropdown from 'in-alerting/components/RevisionDropdown';
import { getRevision } from 'in-alerting/components/AlertHeader';

export default {
  title: 'Molecules|alerting/RevisionDropdown',
  component: RevisionDropdown
};

export const RevisionDropdownNewConfigs = () => {
  const [alertConfig, setAlertConfig] = useState(newVersioningFormatData.alertConfig);
  const alertRevision = getRevision(alertConfig, newVersioningFormatData.alertConfigVersions) || 1;

  return (
    <RevisionDropdown
      {...newVersioningFormatData}
      alertRevision={alertRevision}
      setRevision={created => {
        setAlertConfig(newVersioningFormatData.alertConfigVersions.find(acv => acv.created === created));
      }}
    />
  );
};

export const RevisionDropdownOldConfigs = () => {
  const [alertConfig, setAlertConfig] = useState(oldVersioningFormatData.alertConfig);
  const alertRevision = getRevision(alertConfig, oldVersioningFormatData.alertConfigVersions) || 1;

  return (
    <RevisionDropdown
      {...oldVersioningFormatData}
      alertRevision={alertRevision}
      setRevision={created => {
        setAlertConfig(oldVersioningFormatData.alertConfigVersions.find(acv => acv.created === created));
      }}
    />
  );
};

export const RevisionDropdownMixedConfigs = () => {
  const [alertConfig, setAlertConfig] = useState(mixedVersioningFormatData.alertConfig);
  const alertRevision = getRevision(alertConfig, mixedVersioningFormatData.alertConfigVersions) || 1;

  return (
    <RevisionDropdown
      {...mixedVersioningFormatData}
      alertRevision={alertRevision}
      setRevision={created => {
        setAlertConfig(mixedVersioningFormatData.alertConfigVersions.find(acv => acv.created === created));
      }}
    />
  );
};

const CHANGE_TYPE = {
  UPDATE: 'UPDATE',
  CREATE: 'CREATE',
  DISABLE: 'DISABLE',
  ENABLE: 'ENABLE',
  DELETE: 'DELETE',
  RESTORE: 'RESTORE',
  UNKNOWN: 'UNKNOWN'
};

const newVersioningFormatData = {
  alertConfig: {
    id: 'TMS_EISKQzSAAsBk5qjq7Q',
    created: 1626796474219,
    readOnly: false,
    enabled: true,
    ...getChangeSummary(CHANGE_TYPE.UPDATE, 'Foo man chu')
  },
  alertConfigVersions: [
    {
      id: 'TMS_EISKQzSAAsBk5qjq7Q',
      created: 1626796474219,
      enabled: true,
      deleted: false,
      ...getChangeSummary(CHANGE_TYPE.DELETE, 'Alfred. E. Neumann')
    },
    {
      id: 'TMS_EISKQzSAAsBk5qjq7Q',
      created: 1626793047094,
      enabled: true,
      deleted: false,
      ...getChangeSummary(CHANGE_TYPE.RESTORE, 'D. Snyder')
    },
    {
      id: 'TMS_EISKQzSAAsBk5qjq7Q',
      created: 1626732000000,
      enabled: true,
      deleted: false,
      ...getChangeSummary(CHANGE_TYPE.ENABLE, 'D. Snyder')
    },
    {
      id: 'TMS_EISKQzSAAsBk5qjq7Q',
      created: 1626645600000,
      enabled: true,
      deleted: false,
      ...getChangeSummary(CHANGE_TYPE.DISABLE, 'Erna')
    },
    {
      id: 'TMS_EISKQzSAAsBk5qjq7Q',
      created: 1626559200000,
      enabled: true,
      deleted: false,
      ...getChangeSummary(
        CHANGE_TYPE.UPDATE,
        'Very Long Name Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo '
      )
    },
    {
      id: 'TMS_EISKQzSAAsBk5qjq7Q',
      created: 1626472800000,
      enabled: true,
      deleted: false,
      ...getChangeSummary(CHANGE_TYPE.UPDATE, 'Fabolous Mr. Fox')
    },
    {
      id: 'TMS_EISKQzSAAsBk5qjq7Q',
      created: 1626386400000,
      enabled: true,
      deleted: false,
      ...getChangeSummary(CHANGE_TYPE.UPDATE, 'Lemmy Kilmister')
    },
    {
      id: 'TMS_EISKQzSAAsBk5qjq7Q',
      created: 1626300000000,
      enabled: true,
      deleted: false,
      ...getChangeSummary(CHANGE_TYPE.CREATE, 'Nina Hagen')
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
      deleted: false
    },
    {
      id: 'TMS_EISKQzSAAsBk5qjq7Q',
      created: 1626793047094,
      enabled: true,
      deleted: false
    },
    {
      id: 'TMS_EISKQzSAAsBk5qjq7Q',
      created: 1626732000000,
      enabled: true,
      deleted: false
    },
    {
      id: 'TMS_EISKQzSAAsBk5qjq7Q',
      created: 1626645600000,
      enabled: true,
      deleted: false
    },
    {
      id: 'TMS_EISKQzSAAsBk5qjq7Q',
      created: 1626559200000,
      enabled: true,
      deleted: false
    },
    {
      id: 'TMS_EISKQzSAAsBk5qjq7Q',
      created: 1626472800000,
      enabled: true,
      deleted: false
    },
    {
      id: 'TMS_EISKQzSAAsBk5qjq7Q',
      created: 1626386400000,
      enabled: true,
      deleted: false
    },
    {
      id: 'TMS_EISKQzSAAsBk5qjq7Q',
      created: 1626300000000,
      enabled: true,
      deleted: false
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
