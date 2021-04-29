/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { compose, pure } from 'recompose';
import { get } from 'lodash';
import React from 'react';

import getWebsiteMetrics from 'in-websites/subscriptions/getWebsiteMetrics';
import LearnMoreCard from 'in-websites/LearnMoreCard/LearnMoreCard';
import { minutes } from 'in-services/time';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

import locals from './LearnMoreUserPointer.mless';

const timeConfig = {
  to: null,
  focusedMoment: null,
  windowSize: minutes.toMillis(30),
  autoRefresh: false
};

const explanation = t('in-websites:websiteDashboard.components.learnMoreUserPointerExplanation').trim();

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
      title={t('in-websites:websiteDashboard.components.learnMoreUserPointerTitle')}
      explanation={explanation}
      learnMoreHref="https://instana.com/docs/website_monitoring/api/#identifying-users"
      learnMoreLabel={t('in-websites:websiteDashboard.components.learnMoreUserPointerLearnMoreLabel')}
    />
  );
}
