/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { uniq, find } from 'lodash';
import React from 'react';

import { SvgIcon, Link, Button } from '@instana/components';

import { isBlank, isNotBlank } from 'in-services/util/string';
import UserIcon from 'in-components/UserIcon/UserIcon';
import { redirectURL } from '../../constants';
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

  const redirectToDoc = () => {
    let docURL = '';

    // Check if beacon and agentVersion are valid
    if (beacon?.agentVersion) {
      const { agentVersion, platform } = beacon;
      //check for flutter
      if (agentVersion.includes(':f:')) {
        docURL = redirectURL?.flutterIdentifyingUserDoc;
        // check for react native
      } else if (agentVersion.includes(':r:')) {
        docURL = redirectURL?.reactNativeIdentifyingUserDoc;
      } else {
        // Determine URL based on platform
        docURL = platform === 'Android' ? redirectURL?.androidIdentifyingUserDoc : redirectURL?.iosIdentifyingUserDoc;
      }
    } else {
      // Handle case where beacon or agentVersion is missing
      docURL = redirectURL?.mobileMonitoringDoc;
    }
    return docURL;
  };

  if (!first) {
    first = (
      <div className={locals.noUserData}>
        {t('in-mobile-apps:beaconUserSum.noUserData')}&nbsp;
        <Button href={redirectToDoc()} kind="primaryv2" target="_blank" size="compact">
          {t('in-mobile-apps:beaconUserSum.noUserDataGuide')}
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
            <Tooltip content={t('in-mobile-apps:beaconUserSum.userTooltipContent')}>
              <Link href={redirectToDoc()} className={locals.firstBeaconIsMissingUserDataLink} external>
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
