/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import MobileAppGeoDetailRemoval from 'in-mobile-apps/MobileAppDashboard/tabs/Configuration/Options/MobileAppGeoDetailRemoval';
import MobileAppIpMasking from 'in-mobile-apps/MobileAppDashboard/tabs/Configuration/Options/MobileAppIpMasking';
import Row from 'in-websites/WebsiteDashboard/tabs/Configuration/Options/OptionsRow';

export interface Props {
  mobileAppId: string;
}

export default function Options(props: Props) {
  return (
    <>
      <Row>
        <MobileAppIpMasking {...props} />
      </Row>
      <Row>
        <MobileAppGeoDetailRemoval {...props} />
      </Row>
    </>
  );
}
