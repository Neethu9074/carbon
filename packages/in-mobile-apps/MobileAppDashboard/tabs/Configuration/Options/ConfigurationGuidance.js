/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Card } from '@instana/components';
import React from 'react';

import { getReportingUrl } from 'in-mobile-apps/configuration';
import KeyValue from 'in-new-components/lists/KeyValue';
import { Ul, Li } from 'in-new-components/lists/List';
import Button from 'in-new-components/Button';
import { t } from 'in-i18n';

export default function ConfigurationGuidance({ mobileAppId }) {
  return (
    <Card
      title={t('in-mobile-apps:dashboard.tabs.configurationTitle')}
      header={
        <Button kind="primaryv2" href="https://instana.com/docs/mobile_app_monitoring/#installation" target="_blank">
          {t('in-mobile-apps:dashboard.tabs.installationInstructionsBtn')}
        </Button>
      }
    >
      <Ul>
        <Li>
          <KeyValue label={t('in-mobile-apps:dashboard.tabs.keyLabel')} value={mobileAppId} accentuated />
        </Li>
        <Li>
          <KeyValue
            label={t('in-mobile-apps:dashboard.tabs.reportingURLLabel')}
            value={getReportingUrl()}
            accentuated
          />
        </Li>
      </Ul>
    </Card>
  );
}
