import React, { Fragment } from 'react';
import { get } from 'lodash';

import Deprecation from 'in-websites/WebsiteDashboard/components/Deprecations/Deprecation';
import { translateDemocratisationTagFiltersToAnalyzeTagFilters } from 'in-websites/tags';
import getWebsiteMetrics from 'in-subscription/websiteMonitoring/getWebsiteMetrics';
import { number, percentage } from 'in-services/formatters/number';
import { getLinkToAnalyze } from 'in-websites/navigation/paths';
import { getEumSnippet } from 'in-services/eum';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';
import Code from 'in-components/Code';

const timeConfig = {
  windowSize: 1000 * 60 * 60 * 12,
  to: null,
  focusedMoment: null,
  autoRefresh: false
};

export default connectTo(({ tagFilters }) => ({
  totalBeaconsResult: getWebsiteMetrics({
    timeConfig,
    tagFilters,
    metrics: {
      beacons: {
        metric: 'beaconCount',
        aggregation: 'SUM'
      }
    }
  }),
  deprecatedBeaconsResult: getWebsiteMetrics({
    timeConfig,
    tagFilters: tagFilters.concat({
      name: 'beacon.deprecations',
      operator: 'EQUALS',
      stringValue: 'xrf'
    }),
    metrics: {
      beacons: {
        metric: 'beaconCount',
        aggregation: 'SUM'
      }
    }
  })
}))(CrossRegionForwarding);

function CrossRegionForwarding({ websiteId, websiteLabel, totalBeaconsResult, deprecatedBeaconsResult, tagFilters }) {
  const total = get(totalBeaconsResult, ['data', 'beacons', 0, 1]);
  const deprecated = get(deprecatedBeaconsResult, ['data', 'beacons', 0, 1]);

  const firstParagraph = (
    <Fragment>
      Within the last twelve hours we received data from a JavaScript snippet embedded which is either missing or has an
      incorrect <code>reportingUrl</code> definition. In the future, we cannot guarantee that the JavaScript agent will
      continue to work without a correct <code>reportingUrl</code>.
    </Fragment>
  );
  return (
    <Deprecation title="Missing / Wrong Reporting URL" preview={firstParagraph} supportedUntil="2019-06-01">
      <p>{firstParagraph}</p>
      {total != null &&
        deprecated != null && (
          <p>
            In total we received {number.compact(total)} data points within the last twelve hours.&nbsp;
            <Link
              href$={getLinkToAnalyze({
                beaconType: 'pageLoad',
                tagFilters: translateDemocratisationTagFiltersToAnalyzeTagFilters({
                  websiteLabel,
                  tagFilters: tagFilters.concat({
                    name: 'beacon.deprecations',
                    operator: 'EQUALS',
                    stringValue: 'xrf'
                  })
                }),
                group: {
                  groupbyTag: 'beacon.location.origin'
                }
              })}
            >
              {number.compact(deprecated)} data points ({percentage.detailed(deprecated / total)})
            </Link>{' '}
            would be lost without a correct <code>reportingUrl</code> definition.
          </p>
        )}
      <p>
        Please correct the JavaScript snippet by defining the <code>reportingUrl</code>. It can be defined next to the
        key definition like the following snippet shows.
      </p>
      <Code code={getEumSnippet({ key: websiteId })} lang="html" showLineNumbers={false} />
    </Deprecation>
  );
}
