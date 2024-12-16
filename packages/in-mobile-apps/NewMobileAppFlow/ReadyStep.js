/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { KeyValue, Ul, Li, Link, Button } from '@instana/components';

import Paragraph from 'in-mobile-apps/NewMobileAppFlow/Paragraph';
import { getReportingUrl } from 'in-mobile-apps/configuration';
import Actions from 'in-mobile-apps/NewMobileAppFlow/Actions';
import Frame from 'in-mobile-apps/NewMobileAppFlow/Frame';
import { t, Trans } from 'in-i18n';

export default function ReadyStep({ mobileAppName, mobileAppId, linkToMobileAppHref }) {
  return (
    <Frame title={t('in-mobile-apps:newAppFlow.everythingIsReadyTitle')}>
      <Paragraph>
        <Trans
          i18nKey="in-mobile-apps:newAppFlow.everythingIsReadyMsg"
          values={{ mobileAppName: mobileAppName }}
          components={{
            linkToInstallation: <Link href="https://ibm.biz/mobile-applications-installation" external />
          }}
        />
      </Paragraph>

      <Ul>
        <Li>
          <KeyValue label={t('in-mobile-apps:newAppFlow.keyLabel')} value={mobileAppId} accentuated />
        </Li>
        <Li>
          <KeyValue label={t('in-mobile-apps:newAppFlow.reportingURLLabel')} value={getReportingUrl()} accentuated />
        </Li>
      </Ul>

      <Actions>
        <Button kind="secondary" href="https://ibm.biz/mobile-applications-installation" target="_blank">
          {t('in-mobile-apps:newAppFlow.installationInstructionsBtn')}
        </Button>

        <Button kind="primaryv2" href={linkToMobileAppHref}>
          {t('in-mobile-apps:newAppFlow.GoToMobileAppDashboardBtn')}
        </Button>
      </Actions>
    </Frame>
  );
}
