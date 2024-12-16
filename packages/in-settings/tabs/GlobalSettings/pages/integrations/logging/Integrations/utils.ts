/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import {
  globalSettingsIntegrationsLoggingCoralogix,
  globalSettingsIntegrationsLoggingElk,
  globalSettingsIntegrationsLoggingHumio,
  globalSettingsIntegrationsLoggingMezmo,
  globalSettingsIntegrationsLoggingSplunk
} from 'in-settings/navigation/paths';
import { integrationKey as coralogix } from 'in-integrations/logging/coralogix/consts';
import { integrationKey as splunk } from 'in-integrations/logging/splunk/consts';
import { integrationKey as mezmo } from 'in-integrations/logging/mezmo/consts';
import { integrationKey as humio } from 'in-integrations/logging/humio/consts';
import { integrationKey as elk } from 'in-integrations/logging/elk/consts';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { t } from 'in-i18n';

export function getIntegrationsSubPages() {
  return [
    {
      path: globalSettingsIntegrationsLoggingCoralogix,
      type: coralogix,
      label: t('in-settings:tabs.coralogix')
    },
    {
      path: globalSettingsIntegrationsLoggingElk,
      type: elk,
      label: t('in-settings:tabs.elk')
    },
    {
      path: globalSettingsIntegrationsLoggingHumio,
      type: humio,
      label: t('in-settings:tabs.humio')
    },
    {
      path: globalSettingsIntegrationsLoggingMezmo,
      type: mezmo,
      label: t('in-settings:tabs.mezmo')
    },
    {
      path: globalSettingsIntegrationsLoggingSplunk,
      type: splunk,
      label: t('in-settings:tabs.splunk')
    }
  ];
}
type Variant = 'success' | 'error';

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
  isConfigurable?: string;
}

export const callToastFlyout = (variant: Variant, content: React.ReactNode) => {
  return addMessage({
    type: variant === 'success' ? 'info' : 'danger',
    content,
    timeout: 5000
  });
};
