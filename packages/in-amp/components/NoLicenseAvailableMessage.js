/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import Message from 'in-new-components/Message';
import { t } from 'in-i18n';

export default function NoLicenseAvailableMessage() {
  return (
    <Message
      withIcon
      title={t('in-amp:components.noLicenseAvailableMessage.thereHasBeenNoActivePaidLicenseInThePast30Days')}
    />
  );
}
