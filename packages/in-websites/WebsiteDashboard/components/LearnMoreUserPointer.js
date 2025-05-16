/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useMemo } from 'react';
import { get } from 'lodash';

import { useObservable } from '@instana/hooks';

import getWebsiteMetrics from 'in-websites/subscriptions/getWebsiteMetrics';
import LearnMoreCard from 'in-websites/LearnMoreCard/LearnMoreCard';
import { URL } from 'in-websites/constants';
import { minutes } from 'in-services/time';
import { t } from 'in-i18n';

import locals from './LearnMoreUserPointer.mless';

const timeConfig = {
  to: null,
  focusedMoment: null,
  windowSize: minutes.toMillis(30),
  autoRefresh: false
};

const explanation = t('in-websites:websiteDashboard.components.learnMoreUserPointerExplanation').trim();

export default function LearnMoreUserPointer({ websiteId }) {
  const totalBeaconsResult = useObservable(() => {
    return getWebsiteMetrics({
      timeConfig,
      tagFilters: [{ name: 'beacon.website.id', operator: 'EQUALS', stringValue: websiteId }],
      metrics: {
        count: {
          metric: 'beaconCount',
          aggregation: 'SUM'
        }
      }
    });
  }, [websiteId]);
  const totalBeaconsWithUserResult = useObservable(() => {
    return getWebsiteMetrics({
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
    });
  }, [websiteId]);
  return useMemo(() => {
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
        learnMoreHref={URL.learnToAddUserData}
        learnMoreLabel={t('in-websites:websiteDashboard.components.learnMoreUserPointerLearnMoreLabel')}
      />
    );
  }, [totalBeaconsResult, totalBeaconsWithUserResult]);
}
