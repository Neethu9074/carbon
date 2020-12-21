import { combineLatest } from '@instana/observables';
import { find } from 'lodash';
import React from 'react';

import KeyValueHeader from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/KeyValueHeader';
import BodyHeader from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/BodyHeader';
import getWebsiteBeaconsForPageLoad from 'in-websites/subscriptions/getWebsiteBeaconsForPageLoad';
import { getLinkToPageLoad } from 'in-websites/navigation/paths';
import { latencyFixed } from 'in-services/formatters/number';
import { Row, Col } from 'in-new-components/layout/Grid';
import Button from 'in-new-components/Button';
import connectTo from 'in-hoc/connectTo';

import locals from './ReferencedPageLoads.mless';

export default connectTo(({ beacon }) => {
  if (!beacon.meta.pageLoadIds) {
    return {};
  }

  let pageLoadIds;
  try {
    pageLoadIds = JSON.parse(beacon.meta.pageLoadIds);
  } catch (e) {
    // probably not in the standard format / something the customer defined differently
    return {};
  }

  if (!(pageLoadIds instanceof Array)) {
    // probably not in the standard format / something the customer defined differently
    return {};
  }

  const areAllElementsInArrayStrings = pageLoadIds.reduce((agg, id) => agg && typeof id === 'string', true);
  if (!areAllElementsInArrayStrings) {
    return {};
  }

  if (pageLoadIds.length === 0) {
    return {};
  }

  const pageLoads$ = pageLoadIds.map(pageLoadId =>
    getWebsiteBeaconsForPageLoad({
      pageLoadId,
      beaconTimestamp: beacon.timestamp
    })
      .map(result => result.data)
      .filter(Boolean)
  );

  return {
    pageLoads: combineLatest(pageLoads$, false)
  };
})(ReferencedPageLoads);

function ReferencedPageLoads({ pageLoads }) {
  if (!pageLoads || pageLoads.length === 0) {
    return null;
  }

  return (
    <Row>
      <Col lg={12}>
        <BodyHeader>Referenced Page Loads</BodyHeader>

        {pageLoads.filter(Boolean).map(beacons => (
          <ReferencedPageLoad key={beacons[0].pageLoadId} beacons={beacons} />
        ))}
      </Col>
    </Row>
  );
}

function ReferencedPageLoad({ beacons }) {
  const pageLoad = find(beacons, b => b.type === 'pageLoad');
  if (!pageLoad) {
    // can happen for incomplete page load data
    return null;
  }

  return (
    <div className={locals.pageLoad}>
      <div className={locals.leftSide}>
        <KeyValueHeader label="Page Load" value={pageLoad.locationUrl} />
        <KeyValueHeader label="onLoad Time" value={latencyFixed.compact(pageLoad.duration)} />
        <KeyValueHeader label="Page" value={pageLoad.page || 'N/A'} />
      </div>

      <Button
        className={locals.button}
        size="compact"
        href$={getLinkToPageLoad({
          pageLoadId: pageLoad.pageLoadId,
          beaconTimestamp: pageLoad.timestamp
        })}
      >
        Inspect
      </Button>
    </div>
  );
}
