/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { t } from '@instana/i18n-react';

import MoreMenuButton from 'in-components/MoreMenu/MoreMenuButton';
import MoreMenu from 'in-components/MoreMenu/MoreMenu';

export default function SloActions() {
  return (
    <MoreMenu kind="subtle">
      <MoreMenuButton icon="lib_actions_edit">{t('in-service-levels:general.editButtonLabel')}</MoreMenuButton>
      <MoreMenuButton icon="lib_actions_copy">{t('in-service-levels:general.copyButtonLabel')}</MoreMenuButton>
      <MoreMenuButton icon="lib_actions_delete">{t('in-service-levels:general.deleteButtonLabel')}</MoreMenuButton>
    </MoreMenu>
  );
}
