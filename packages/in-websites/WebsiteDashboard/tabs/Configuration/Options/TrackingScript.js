/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState, useEffect } from 'react';

import { Card } from '@instana/components';
import { Link } from '@instana/components';

import HelpParagraph from 'in-websites/WebsiteDashboard/tabs/Configuration/Options/HelpParagraph';
import TrackingSnippetPresenter from 'in-websites/trackingSnippet/TrackingSnippetPresenter';
import getWebsiteBeaconGroups from 'in-websites/subscriptions/getWebsiteBeaconGroups';
import { Trans, SecureString } from 'in-i18n';
import { t } from 'in-i18n';

export default function TrackingScript({ websiteId, websiteLabel }) {
  const [trackSessions, setTrackSessions] = useState(true);
  const [enableSRI, setEnableSRI] = useState(true);
  const [userVersion, setUserVersion] = useState('');

  useEffect(() => {
    getWebsiteBeaconGroups({
      timeConfig: {
        windowSize: 86400000
      },
      pagination: {
        retrievalSize: 1
      },
      tagFilterExpression: {
        type: 'TAG_FILTER',
        name: 'beacon.website.name',
        operator: 'EQUALS',
        entity: 'NOT_APPLICABLE',
        value: websiteLabel
      },
      metrics: {
        beaconCount: {
          metric: 'beaconCount',
          aggregation: 'SUM'
        }
      },
      type: 'PAGELOAD',
      order: {
        by: 'name',
        direction: 'DESC'
      },
      group: {
        groupbyTag: 'beacon.agentVersion',
        tagType: 'STRING'
      }
    })
      .map(r => {
        const response = r.data;
        const version = response?.items[0]?.name;
        setUserVersion(version.replace(/"/g, ''));
      })
      .subscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card title={t('in-websites:websiteDashboard.tabs.configuration.configurationTrackingScriptTitle')}>
      {userVersion && (
        <HelpParagraph>
          <Trans
            i18nKey="in-websites:websiteDashboard.tabs.configuration.configurationUserAgentVersion"
            values={{ agentVersion: userVersion }}
          />
        </HelpParagraph>
      )}
      <HelpParagraph>
        <Trans
          i18nKey="in-websites:trackingScript.help"
          values={{ htmlElementName: new SecureString('<head />') }}
          components={{
            linkToDocs: <Link href="https://ibm.biz/monitoring-websites" external />
          }}
        />
      </HelpParagraph>

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
