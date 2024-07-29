/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import {
  teamSettingsIntegrationsLoggingCoralogix,
  teamSettingsIntegrationsLoggingElk,
  teamSettingsIntegrationsLoggingHumio,
  teamSettingsIntegrationsLoggingMezmo,
  teamSettingsIntegrationsLoggingSplunk
} from 'in-settings/navigation/paths';
import { integrationKey as coralogix } from 'in-integrations/logging/coralogix/consts';
import { integrationKey as splunk } from 'in-integrations/logging/splunk/consts';
import { integrationKey as mezmo } from 'in-integrations/logging/mezmo/consts';
import { integrationKey as humio } from 'in-integrations/logging/humio/consts';
import { integrationKey as elk } from 'in-integrations/logging/elk/consts';
import { t } from 'in-i18n';

export function getIntegrationsSubPages() {
  return [
    {
      path: teamSettingsIntegrationsLoggingCoralogix,
      type: coralogix,
      label: t('in-settings:tabs.coralogix')
    },
    {
      path: teamSettingsIntegrationsLoggingElk,
      type: elk,
      label: t('in-settings:tabs.elk')
    },
    {
      path: teamSettingsIntegrationsLoggingHumio,
      type: humio,
      label: t('in-settings:tabs.humio')
    },
    {
      path: teamSettingsIntegrationsLoggingMezmo,
      type: mezmo,
      label: t('in-settings:tabs.mezmo')
    },
    {
      path: teamSettingsIntegrationsLoggingSplunk,
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
