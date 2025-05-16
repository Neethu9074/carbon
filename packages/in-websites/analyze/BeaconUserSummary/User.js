/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { uniq, find } from 'lodash';
import React from 'react';

import { SvgIcon, Link, Button } from '@instana/components';

import { isBlank, isNotBlank } from 'in-services/util/string';
import UserIcon from 'in-components/UserIcon/UserIcon';
import Tooltip from 'in-components/Tooltip';
import { URL } from 'in-websites/constants';
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
        <Button href={URL.learnToAddUserData} kind="primaryv2" target="_blank" size="compact">
          {t('in-websites:analyze.analyzeView.beaconUserSummary.learnHowToAddUserData')}
        </Button>
      </div>
    );
  }

  return (
    <div className={locals.user}>
      <UserIcon size="xl" />
      <div className={locals.info}>
        <div className={locals.first}>
          <span className={locals.firstText}>{first}</span>{' '}
          {firstBeaconIsMissingUserData && (
            <Tooltip content="Only a subset of the beacons of this page load have associated user data. This can result in surprising statistics and analyze results.">
              <Link
                external
                href={URL.learnToAddUserData}
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
