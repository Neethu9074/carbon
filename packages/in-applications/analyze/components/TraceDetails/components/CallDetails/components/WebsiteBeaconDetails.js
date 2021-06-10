/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { Button } from '@instana/components';

import BodyHeader from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/BodyHeader';
import TypeHeader from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/TypeHeader';
import { getType, types } from 'in-websites/analyze/PageLoadView/tabs/Summary/filterableTypes';
import { getHighlighterId } from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon';
import { triggerHighlight } from 'in-components/SelectedElementHighlighter';
import { Dl, Di } from 'in-components/HorizontalDescriptionList';
import { explanations } from 'in-websites/cacheInteractionTypes';
import { getLinkToPageLoad } from 'in-websites/navigation/paths';
import { bytes } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default function WebsiteBeaconDetails({ beacon }) {
  const type = getType(beacon);
  const typeDefinition = types[type];

  const hasTransferSize = beacon.transferSize >= 0;
  const hasEncodedBodySize = beacon.encodedBodySize >= 0;
  const hasDencodedBodySize = beacon.decodedBodySize >= 0;
  const hasCacheInteraction = !!explanations[beacon.cacheInteraction];
  const hasNetworkInsights = hasTransferSize || hasEncodedBodySize || hasDencodedBodySize || hasCacheInteraction;

  return (
    <Fragment>
      <Dl>
        <Di title={t('in-analyze:traceDetail.components.callDetails.windowLocation')}>
          <a href={beacon.locationUrl} rel="noopener noreferrer" target="_blank">
            {beacon.locationUrl}
          </a>
        </Di>
        {beacon.type === 'resourceLoad' && (
          <Di title={t('in-analyze:traceDetail.components.callDetails.resourceUri')}>
            <a href={beacon.httpCallUrl} rel="noopener noreferrer" target="_blank">
              {beacon.httpCallUrl}
            </a>
          </Di>
        )}
        {beacon.type === 'httpRequest' && (
          <Di title={t('in-analyze:traceDetail.components.callDetails.httpCallUri')}>
            <a href={beacon.httpCallUrl} rel="noopener noreferrer" target="_blank">
              {beacon.httpCallUrl}
            </a>
          </Di>
        )}
        <Di title={t('in-analyze:traceDetail.components.callDetails.beaconType')}>
          {typeDefinition.long} <TypeHeader beacon={beacon} />
        </Di>
      </Dl>

      {hasNetworkInsights && (
        <Fragment>
          <BodyHeader>{t('in-analyze:traceDetail.components.callDetails.networkInsights')}</BodyHeader>
          <Dl>
            <Di title={t('in-analyze:traceDetail.components.callDetails.cacheInteraction')}>
              {explanations[beacon.cacheInteraction]}
            </Di>
            {hasTransferSize && (
              <Di title={t('in-analyze:traceDetail.components.callDetails.transferSize')}>
                {bytes.detailed(beacon.transferSize)}
              </Di>
            )}
            {hasEncodedBodySize && (
              <Di title={t('in-analyze:traceDetail.components.callDetails.encodedBodySize')}>
                {bytes.detailed(beacon.encodedBodySize)}
              </Di>
            )}
            {hasDencodedBodySize && (
              <Di title={t('in-analyze:traceDetail.components.callDetails.decodedBodySize')}>
                {bytes.detailed(beacon.decodedBodySize)}
              </Di>
            )}
          </Dl>
        </Fragment>
      )}
      <Button
        onClick={() => triggerHighlight(getHighlighterId(beacon.beaconId))}
        href$={getLinkToPageLoad({
          pageLoadId: beacon.pageLoadId,
          beaconTimestamp: beacon.timestamp
        })}
        kind="primary"
        size="compact"
      >
        {t('in-analyze:traceDetail.components.callDetails.goToBeacon')}
      </Button>
    </Fragment>
  );
}
