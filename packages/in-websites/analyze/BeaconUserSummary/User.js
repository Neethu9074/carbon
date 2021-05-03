/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { uniq, find } from 'lodash';
import React from 'react';

import { SvgIcon } from '@instana/components';
import { Link } from '@instana/components';

import { isBlank, isNotBlank } from 'in-services/util/string';
import Button from 'in-new-components/Button';
import Gravatar from 'in-components/Gravatar';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './User.mless';

export default function User({ beacon, beacons }) {
  beacons = beacons || [beacon];

  let [first, second, third] = uniq(
    [getValue(beacons, 'userName'), getValue(beacons, 'userEmail'), getValue(beacons, 'userId')]
      .filter(Boolean)
      .filter(isNotBlank)
  );

  const firstBeaconIsMissingUserData =
    first && isBlank(beacon.userId) && isBlank(beacon.userName) && isBlank(beacon.userEmail);

  if (!first) {
    first = (
      <div className={locals.noUserData}>
        {t('in-websites:analyze.analyzeView.beaconUserSummary.noUserDataDefined')}
        &nbsp;
        <Button
          href="https://instana.com/docs/website_monitoring/api/#identifying-users"
          kind="primaryv2"
          target="_blank"
          size="compact"
        >
          {t('in-websites:analyze.analyzeView.beaconUserSummary.learnHowToAddUserData')}
        </Button>
      </div>
    );
  }

  return (
    <div className={locals.user}>
      <Gravatar email={beacon.userEmail} size="l" />
      <div className={locals.info}>
        <div className={locals.first}>
          <span className={locals.firstText}>{first}</span>{' '}
          {firstBeaconIsMissingUserData && (
            <Tooltip content="Only a subset of the beacons of this page load have associated user data. This can result in surprising statistics and analyze results.">
              <Link
                external
                href="https://instana.com/docs/website_monitoring/api/#identifying-users"
                className={locals.firstBeaconIsMissingUserDataLink}
              >
                <SvgIcon type="lib_help_error_warning" className={locals.firstBeaconIsMissingUserData} size="s" />
              </Link>
            </Tooltip>
          )}
        </div>
        {second && <div className={locals.second}>{second}</div>}
        {third && <div className={locals.third}>{third}</div>}
      </div>
    </div>
  );
}

function getValue(beacons, field) {
  const beacon = find(beacons, b => isNotBlank(b[field]));
  return beacon ? beacon[field] : undefined;
}
