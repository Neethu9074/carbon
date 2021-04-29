/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Link } from '@instana/components';
import React from 'react';

import TrackingSnippetPresenter from 'in-websites/trackingSnippet/TrackingSnippetPresenter';
import { getTrackingSnippet } from 'in-websites/trackingSnippet';
import Paragraph from 'in-websites/NewWebsiteFlow/Paragraph';
import CopyToClipboard from 'in-components/CopyToClipboard';
import Actions from 'in-websites/NewWebsiteFlow/Actions';
import { Trans, t, markAsSecureString } from 'in-i18n';
import Frame from 'in-websites/NewWebsiteFlow/Frame';
import Button from 'in-new-components/Button';

export default function WaitStep({ websiteId, websiteName, trackSessions, setTrackSessions }) {
  const eumSnippet = getTrackingSnippet({ key: websiteId, trackSessions });

  return (
    <Frame title={t('in-websites:newWebsiteFlow.waitStepTitleWorking')}>
      <Paragraph>
        <Trans
          i18nKey="in-websites:newWebsiteFlow.waitStepParagraphWeArePreparingEverythingToMonitorYourWebsite"
          values={{ websiteName: websiteName, httpHeadTag: markAsSecureString('<head>') }}
          components={{
            linkToDocs: <Link href="https://instana.com/docs/website_monitoring/" external />
          }}
        />
      </Paragraph>

      <TrackingSnippetPresenter
        websiteId={websiteId}
        trackSessions={trackSessions}
        setTrackSessions={setTrackSessions}
      />

      <Actions>
        <CopyToClipboard getText={() => eumSnippet}>
          {refSetter => (
            <Button kind="primaryv2" refSetter={refSetter}>
              {t('in-websites:newWebsiteFlow.waitStepButtonCopyToClipboard')}
            </Button>
          )}
        </CopyToClipboard>

        <Button kind="secondary" disabled icon="lib_actions_loading" iconSpinning>
          {t('in-websites:newWebsiteFlow.waitStepButtonEnablingMonitoring')}
        </Button>
      </Actions>
    </Frame>
  );
}
