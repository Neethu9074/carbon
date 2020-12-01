import { compose, pure } from 'recompose';
import { get } from 'lodash';
import React from 'react';

import getWebsiteMetrics from 'in-websites/subscriptions/getWebsiteMetrics';
import LearnMoreCard from 'in-new-components/Card/LearnMoreCard';
import { minutes } from 'in-services/time';
import connectTo from 'in-hoc/connectTo';

import locals from './LearnMoreUserPointer.mless';

const timeConfig = {
  to: null,
  focusedMoment: null,
  windowSize: minutes.toMillis(30),
  autoRefresh: false
};

const explanation = `
To gain better insights into errors and the impact of these errors, we recommend to set a user ID within the
tracking script. This enables Instana to calculate information about the number of affected users.
It also grants you the ability to search for specific users and their activity.
`.trim();

export default compose(
  pure,
  connectTo(({ websiteId }) => ({
    totalBeaconsResult: getWebsiteMetrics({
      timeConfig,
      tagFilters: [{ name: 'beacon.website.id', operator: 'EQUALS', stringValue: websiteId }],
      metrics: {
        count: {
          metric: 'beaconCount',
          aggregation: 'SUM'
        }
      }
    }),
    totalBeaconsWithUserResult: getWebsiteMetrics({
      timeConfig,
      tagFilters: [
        { name: 'beacon.website.id', operator: 'EQUALS', stringValue: websiteId },
        { name: 'beacon.userIdOrSessionId', operator: 'NOT_EMPTY', stringValue: '' }
      ],
      metrics: {
        count: {
          metric: 'beaconCount',
          aggregation: 'SUM'
        }
      }
    })
  }))
)(LearnMoreUserPointer);

function LearnMoreUserPointer({ totalBeaconsResult, totalBeaconsWithUserResult }) {
  const beaconCount = get(totalBeaconsResult, ['data', 'count', 0, 1]);
  const beaconCountWithUser = get(totalBeaconsWithUserResult, ['data', 'count', 0, 1]);

  if (beaconCount == null || beaconCountWithUser == null || beaconCount < 1 || beaconCountWithUser > 0) {
    return null;
  }

  return (
    <LearnMoreCard
      className={locals.wrapper}
      title="No User Information Defined"
      explanation={explanation}
      learnMoreHref="https://instana.com/docs/website_monitoring/api/#identifying-users"
      learnMoreLabel="Learn how to add user data"
    />
  );
}
