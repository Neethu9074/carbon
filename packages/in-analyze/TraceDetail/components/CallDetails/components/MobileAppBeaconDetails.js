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
          <Di title="HTTP Call URI">
            <a href={beacon.httpCallUrl} rel="noopener noreferrer" target="_blank">
              {beacon.httpCallUrl}
            </a>
          </Di>
        )}
        <Di title="Beacon Type">
          {typeDefinition.long} <TypeHeader beacon={beacon} />
        </Di>
      </Dl>

      {hasNetworkInsights && (
        <Fragment>
          <BodyHeader>Network Insights</BodyHeader>
          <Dl>
            {hasTransferSize && <Di title="Transfer Size">{bytes.detailed(beacon.transferSize)}</Di>}
            {hasEncodedBodySize && <Di title="Encoded Body Size">{bytes.detailed(beacon.encodedBodySize)}</Di>}
            {hasDencodedBodySize && <Di title="Decoded Body Size">{bytes.detailed(beacon.decodedBodySize)}</Di>}
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
        Go to Beacon
      </Button>
    </Fragment>
  );
}
