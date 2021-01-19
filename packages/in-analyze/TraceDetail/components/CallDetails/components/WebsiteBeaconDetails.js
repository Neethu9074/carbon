/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';

import BodyHeader from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/BodyHeader';
import TypeHeader from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/TypeHeader';
import { getType, types } from 'in-websites/analyze/PageLoadView/tabs/Summary/filterableTypes';
import { getHighlighterId } from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon';
import { triggerHighlight } from 'in-new-components/SelectedElementHighlighter';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import { explanations } from 'in-websites/cacheInteractionTypes';
import { getLinkToPageLoad } from 'in-websites/navigation/paths';
import { bytes } from 'in-services/formatters/number';
import Button from 'in-new-components/Button';

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
        <Di title="Window Location">
          <a href={beacon.locationUrl} rel="noopener noreferrer" target="_blank">
            {beacon.locationUrl}
          </a>
        </Di>
        {beacon.type === 'resourceLoad' && (
          <Di title="Resource URI">
            <a href={beacon.httpCallUrl} rel="noopener noreferrer" target="_blank">
              {beacon.httpCallUrl}
            </a>
          </Di>
        )}
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
            <Di title="Cache Interaction">{explanations[beacon.cacheInteraction]}</Di>
            {hasTransferSize && <Di title="Transfer Size">{bytes.detailed(beacon.transferSize)}</Di>}
            {hasEncodedBodySize && <Di title="Encoded Body Size">{bytes.detailed(beacon.encodedBodySize)}</Di>}
            {hasDencodedBodySize && <Di title="Decoded Body Size">{bytes.detailed(beacon.decodedBodySize)}</Di>}
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
        Go to Beacon
      </Button>
    </Fragment>
  );
}
