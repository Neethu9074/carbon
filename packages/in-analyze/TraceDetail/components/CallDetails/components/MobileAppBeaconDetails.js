/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';

import BodyHeader from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/components/BodyHeader';
import TypeHeader from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/components/TypeHeader';
import { getType, types } from 'in-mobile-apps/analyze/SessionView/tabs/Summary/filterableTypes';
import { getHighlighterId } from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon';
import { triggerHighlight } from 'in-new-components/SelectedElementHighlighter';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import { getLinkToSession } from 'in-mobile-apps/navigation/paths';
import { bytes } from 'in-services/formatters/number';
import Button from 'in-new-components/Button';
import { t } from 'in-i18n';

export default function MobileAppBeaconDetails({ beacon }) {
  const type = getType(beacon);
  const typeDefinition = types[type];

  const hasTransferSize = beacon.transferSize >= 0;
  const hasEncodedBodySize = beacon.encodedBodySize >= 0;
  const hasDencodedBodySize = beacon.decodedBodySize >= 0;
  const hasNetworkInsights = hasTransferSize || hasEncodedBodySize || hasDencodedBodySize;

  return (
    <Fragment>
      <Dl>
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
        href$={getLinkToSession({
          sessionId: beacon.sessionId,
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
