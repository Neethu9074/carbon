/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Link, Button } from '@instana/components';

import TrackingSnippetPresenter from 'in-websites/trackingSnippet/TrackingSnippetPresenter';
import Paragraph from 'in-websites/NewWebsiteFlow/Paragraph';
import Actions from 'in-websites/NewWebsiteFlow/Actions';
import Frame from 'in-websites/NewWebsiteFlow/Frame';
import { Trans, t, SecureString } from 'in-i18n';

export default function WaitStep({ websiteId, websiteName, trackSessions, setTrackSessions, enableSRI, setEnableSRI }) {
  return (
    <Frame title={t('in-websites:newWebsiteFlow.waitStepTitleWorking')}>
      <Paragraph>
        <Trans
          i18nKey="in-websites:newWebsiteFlow.waitStepParagraphWeArePreparingEverythingToMonitorYourWebsite"
          values={{ websiteName: websiteName, httpHeadTag: new SecureString('<head />') }}
          components={{
            linkToDocs: <Link href="https://ibm.biz/monitoring-websites" external />
          }}
        />
      </Paragraph>

      <TrackingSnippetPresenter
        websiteId={websiteId}
        trackSessions={trackSessions}
        enableSRI={enableSRI}
        setTrackSessions={setTrackSessions}
        setEnableSRI={setEnableSRI}
      />

      <Actions>
        <Button kind="secondary" disabled icon="lib_actions_loading" iconSpinning>
          {t('in-websites:newWebsiteFlow.waitStepButtonEnablingMonitoring')}
        </Button>
      </Actions>
    </Frame>
  );
}
