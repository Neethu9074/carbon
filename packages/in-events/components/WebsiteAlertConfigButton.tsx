/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Button, CarbonMenuItem } from '@instana/components';

import { WebsiteSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/eum/data/eumAlertConfigTypes';
import { websitesAlertingEventDetailsViewEditConfig } from 'in-alerting/smart-alerts/websites/tracker';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { useGetAlertConfigLink } from 'in-websites/navigation/paths';
import { parseUrl } from 'in-stores/navigation/routing/parser';
import { t } from 'in-i18n';

interface PropsType {
  alertConfig: WebsiteSmartAlertConfigWithMetadata;
  as?: 'button' | 'menuItem';
}
export default function WebsiteAlertConfigButton({ alertConfig, as = 'button' }: PropsType) {
  const getLinkToAlertConfig = useGetAlertConfigLink();
  const { navigate } = useNavigation();

  if (as === 'menuItem') {
    return (
      <CarbonMenuItem
        label={t('in-events:buttonViewAlertConfig')}
        onClick={() => {
          websitesAlertingEventDetailsViewEditConfig({ id: alertConfig.id });
          navigate(parseUrl(getLinkToAlertConfig(alertConfig.id, alertConfig.websiteId, alertConfig.created), true));
        }}
      />
    );
  }

  return (
    <Button
      kind="secondary"
      onClick={() => {
        websitesAlertingEventDetailsViewEditConfig({ id: alertConfig.id });
      }}
      href={getLinkToAlertConfig(alertConfig.id, alertConfig.websiteId, alertConfig.created)}
    >
      {t('in-events:buttonViewAlertConfig')}
    </Button>
  );
}
