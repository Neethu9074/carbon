/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ConfigurationGuidance from 'in-mobile-apps/MobileAppDashboard/tabs/Configuration/Options/ConfigurationGuidance';
import Rename from 'in-mobile-apps/MobileAppDashboard/tabs/Configuration/Options/Rename';
import Remove from 'in-mobile-apps/MobileAppDashboard/tabs/Configuration/Options/Remove';
import Row from 'in-websites/WebsiteDashboard/tabs/Configuration/Options/OptionsRow';

export default function Options(props) {
  return (
    <>
      <Row>
        <Rename {...props} />
      </Row>
      <Row>
        <ConfigurationGuidance {...props} />
      </Row>
      <Row>
        <Remove {...props} />
      </Row>
    </>
  );
}
