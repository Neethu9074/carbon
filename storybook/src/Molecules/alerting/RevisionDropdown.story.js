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
  const [alertConfig, setAlertConfig] = useState(data.alertConfig);
  const alertRevision = getRevision(alertConfig, data.alertConfigVersions) || 1;

  return (
    <RevisionDropdown
      {...data}
      alertRevision={alertRevision}
      setRevision={created => {
        setAlertConfig(data.alertConfigVersions.find(acv => acv.created === created));
      }}
    />
  );
};

export const RevisionDropdownOldConfigs = () => {
  const [alertConfig, setAlertConfig] = useState(oldConfigData.alertConfig);
  const alertRevision = getRevision(alertConfig, oldConfigData.alertConfigVersions) || 1;

  return (
    <RevisionDropdown
      {...oldConfigData}
      alertRevision={alertRevision}
      setRevision={created => {
        setAlertConfig(oldConfigData.alertConfigVersions.find(acv => acv.created === created));
      }}
    />
  );
};

export const RevisionDropdownMixedConfigs = () => {
  const [alertConfig, setAlertConfig] = useState(mixedConfigData.alertConfig);
  const alertRevision = getRevision(alertConfig, mixedConfigData.alertConfigVersions) || 1;

  return (
    <RevisionDropdown
      {...mixedConfigData}
      alertRevision={alertRevision}
      setRevision={created => {
        setAlertConfig(mixedConfigData.alertConfigVersions.find(acv => acv.created === created));
      }}
    />
  );
};

const data = {
  alertConfig: {
    id: 'TMS_EISKQzSAAsBk5qjq7Q',
    created: 1626796474219,
    readOnly: false,
    enabled: true,
    userName: '',
    apiTokenName: '',
    changeType: ''
  },
  alertConfigVersions: [
    {
      id: 'TMS_EISKQzSAAsBk5qjq7Q',
      created: 1626796474219,
      enabled: true,
      deleted: false,
      changeType: 'delete',
      userName: 'Alfred. E. Neumann'
    },
    {
      id: 'TMS_EISKQzSAAsBk5qjq7Q',
      created: 1626793047094,
      enabled: true,
      deleted: false,
      changeType: 'restored',
      userName: 'Rambo'
    },
    {
      id: 'TMS_EISKQzSAAsBk5qjq7Q',
      created: 1626732000000,
      enabled: true,
      deleted: false,
      changeType: 'enabled',
      apiTokenName: 'TMS_EISKQzSAAsBk5qjq7Q'
    },
    {
      id: 'TMS_EISKQzSAAsBk5qjq7Q',
      created: 1626645600000,
      enabled: true,
      deleted: false,
      changeType: 'disabled',
      userName: 'Erna'
    },
    {
      id: 'TMS_EISKQzSAAsBk5qjq7Q',
      created: 1626559200000,
      enabled: true,
      deleted: false,
      changeType: 'update',
      userName: 'Very Long Name Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo '
    },
    {
      id: 'TMS_EISKQzSAAsBk5qjq7Q',
      created: 1626472800000,
      enabled: true,
      deleted: false,
      changeType: 'update',
      userName: 'Fabolous Mr. Fox'
    },
    {
      id: 'TMS_EISKQzSAAsBk5qjq7Q',
      created: 1626386400000,
      enabled: true,
      deleted: false,
      changeType: 'update',
      userName: 'Lemmy Kilmister'
    },
    {
      id: 'TMS_EISKQzSAAsBk5qjq7Q',
      created: 1626300000000,
      enabled: true,
      deleted: false,
      changeType: 'created',
      userName: 'Nina Hagen'
    }
  ],
  alertRevision: 2
};

const oldConfigData = {
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

const mixedConfigData = {
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
      changeType: 'delete',
      userName: 'Alfred. E. Neumann'
    },
    {
      id: 'TMS_EISKQzSAAsBk5qjq7Q',
      created: 1626793047094,
      enabled: true,
      deleted: false,
      changeType: 'restored',
      userName: 'Rambo'
    },
    {
      id: 'TMS_EISKQzSAAsBk5qjq7Q',
      created: 1626732000000,
      enabled: true,
      deleted: false,
      changeType: 'enabled',
      apiTokenName: 'TMS_EISKQzSAAsBk5qjq7Q'
    },
    {
      id: 'TMS_EISKQzSAAsBk5qjq7Q',
      created: 1626645600000,
      enabled: true,
      deleted: false,
      changeType: 'disabled',
      userName: 'Erna'
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
