/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import { Card } from '@instana/components';

import TrackingSnippetPresenter from 'in-websites/trackingSnippet/TrackingSnippetPresenter';
import { t } from 'in-i18n';

import locals from './Rename.mless';

export default function TrackingScript({ websiteId }) {
  const [trackSessions, setTrackSessions] = useState(true);
  const [enableSRI, setEnableSRI] = useState(true);

  return (
    <Card
      title={t('in-websites:websiteDashboard.tabs.configuration.configurationTrackingScriptTitle')}
      headerClassName={locals.title}
      className={locals.configurationBlock}
    >
      <TrackingSnippetPresenter
        websiteId={websiteId}
        trackSessions={trackSessions}
        enableSRI={enableSRI}
        setTrackSessions={setTrackSessions}
        setEnableSRI={setEnableSRI}
      />
    </Card>
  );
}
