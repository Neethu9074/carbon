/*
 * (c) Copyright IBM Corp. 2023
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { CarbonCallout } from '@instana/components';

import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { t } from 'in-i18n';

import locals from './ConfigureIdPInfoMessage.mless';

export default function ConfigureIdPInfoMessage() {
  const { goToPath } = useNavigation();

  return (
    <CarbonCallout
      title={t('in-settings:tabs.apiTokensForDeletion')}
      titleId="settings-idp-can-be-deleted-through-api-modal"
      className={locals.message}
      kind="info"
      lowContrast
      actionButtonLabel={t('in-settings:tabs.viewDocumentation')}
      onActionButtonClick={() =>
        goToPath('https://www.ibm.com/docs/en/instana-observability/current?topic=instana-configuring-authentication')
      }
      subtitle={t('in-settings:tabs.configureIdPCanBeDeletedThroughAPI')}
    />
  );
}
