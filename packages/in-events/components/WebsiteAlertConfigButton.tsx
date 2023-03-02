/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Button } from '@instana/components';

import { websitesAlertingEventDetailsViewEditConfig } from 'in-alerting/smart-alerts/websites/tracker';
import { getLinkToAlertConfig } from 'in-websites/navigation/paths';
import { WebsiteAlertConfigWithMetadata } from 'in-types';
import { t } from 'in-i18n';

interface PropsType {
  alertConfig: WebsiteAlertConfigWithMetadata;
}
export default function WebsiteAlertConfigButton({ alertConfig }: PropsType) {
  return (
    <Button
      kind="secondary"
      onClick={() => {
        websitesAlertingEventDetailsViewEditConfig({ id: alertConfig.id });
      }}
      href$={getLinkToAlertConfig(alertConfig.id, alertConfig.created, alertConfig.websiteId)}
    >
      {t('in-events:buttonViewAlertConfig')}
    </Button>
  );
}
