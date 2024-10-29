/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Integration, Variant } from 'in-settings/tabs/GlobalSettings/pages/integrations/database/types';
import { globalSettingsIntegrationsDatabaseDbMarlin } from 'in-settings/navigation/paths';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { dbMarlin } from 'in-integrations/database/consts';
import { t } from 'in-i18n';

export function getIntegrationsSubPages(): Integration[] {
  return [
    {
      path: globalSettingsIntegrationsDatabaseDbMarlin,
      type: dbMarlin,
      label: t('in-settings:tabs.team.integrations.database.dbMarlin')
    }
  ];
}

export const callToastFlyout = (variant: Variant, title: string, content: string) => {
  return addMessage({
    type: variant === 'success' ? 'info' : 'danger',
    title,
    content,
    timeout: 5000
  });
};
