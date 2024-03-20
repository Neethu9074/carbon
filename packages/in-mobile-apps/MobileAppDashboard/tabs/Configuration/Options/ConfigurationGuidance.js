/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { KeyValue } from '@instana/components';
import { Ul, Li } from '@instana/components';
import { Card } from '@instana/components';
import { Button } from '@instana/legacy';

import { getReportingUrl } from 'in-mobile-apps/configuration';
import { t } from 'in-i18n';

export default function ConfigurationGuidance({ mobileAppId }) {
  return (
    <Card
      title={t('in-mobile-apps:dashboard.tabs.configurationTitle')}
      header={
        <Button kind="primaryv2" href="https://ibm.biz/mobile-applications-installation" target="_blank">
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
