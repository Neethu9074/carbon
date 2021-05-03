/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Button } from '@instana/components';
import { Link } from '@instana/components';

import Paragraph from 'in-mobile-apps/NewMobileAppFlow/Paragraph';
import { getReportingUrl } from 'in-mobile-apps/configuration';
import Actions from 'in-mobile-apps/NewMobileAppFlow/Actions';
import Frame from 'in-mobile-apps/NewMobileAppFlow/Frame';
import KeyValue from 'in-new-components/lists/KeyValue';
import { Ul, Li } from 'in-new-components/lists/List';
import { t, Trans } from 'in-i18n';

export default function WaitStep({ mobileAppName, mobileAppId }) {
  return (
    <Frame title={t('in-mobile-apps:newAppFlow.workingTitle')}>
      <Paragraph>
        <Trans
          i18nKey="in-mobile-apps:newAppFlow.workingMsg"
          values={{ mobileAppName: mobileAppName }}
          components={{
            linkToInstallation: (
              <Link href="https://instana.com/docs/mobile_app_monitoring/#installation" target="_blank" />
            )
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
        <Button kind="primaryv2" href="https://instana.com/docs/mobile_app_monitoring/#installation" target="_blank">
          {t('in-mobile-apps:newAppFlow.installationInstructionsBtn')}
        </Button>

        <Button kind="secondary" disabled icon="lib_actions_loading" iconSpinning>
          {t('in-mobile-apps:newAppFlow.enablingMonitoringBtn')}
        </Button>
      </Actions>
    </Frame>
  );
}
