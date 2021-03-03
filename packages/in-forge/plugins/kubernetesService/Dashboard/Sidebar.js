/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import Collapsible from 'in-sdk/components/sidebar/Collapsible';

export default function KubernetesPodSidebar() {
  return (
    <Collapsible>
      <Collapsible.Header>{t('in-forge:plugins.kubernetesService.kubernetesService')}</Collapsible.Header>
      <Collapsible.Content />
    </Collapsible>
  );
}
