/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import {
  teamSettingsLogManagementCoralogix,
  teamSettingsLogManagementElk,
  teamSettingsLogManagementHumio,
  teamSettingsLogManagementLogDna,
  teamSettingsLogManagementSplunk
} from 'in-settings/navigation/paths';
import { integrationKey as coralogix } from 'in-integrations/logging/coralogix/consts';
import { integrationKey as logdna } from 'in-integrations/logging/logdna/consts';
import { integrationKey as splunk } from 'in-integrations/logging/splunk/consts';
import { integrationKey as humio } from 'in-integrations/logging/humio/consts';
import { integrationKey as elk } from 'in-integrations/logging/elk/consts';
import { t } from 'in-i18n';

export function getIntegrationsSubPages() {
  return [
    {
      path: teamSettingsLogManagementCoralogix,
      type: coralogix,
      label: t('in-settings:tabs.coralogix')
    },
    {
      path: teamSettingsLogManagementElk,
      type: elk,
      label: t('in-settings:tabs.elk')
    },
    {
      path: teamSettingsLogManagementHumio,
      type: humio,
      label: t('in-settings:tabs.humio')
    },
    {
      path: teamSettingsLogManagementLogDna,
      type: logdna,
      label: t('in-settings:tabs.mezmo')
    },
    {
      path: teamSettingsLogManagementSplunk,
      type: splunk,
      label: t('in-settings:tabs.splunk')
    }
  ];
}
export type Variant = 'success' | 'error';

export interface Integration {
  path: string;
  type: string;
  label: string;
  url?: string;
  index?: string;
  baseUrl?: string;
  enabled?: boolean;
  team?: string;
  acccountId?: string;
  repository?: string;
  instanceType?: string;
}
