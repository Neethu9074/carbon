/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import TrackingScript from 'in-websites/WebsiteDashboard/tabs/Configuration/Options/TrackingScript';
import Row from 'in-websites/WebsiteDashboard/tabs/Configuration/Options/OptionsRow';
import Rename from 'in-websites/WebsiteDashboard/tabs/Configuration/Options/Rename';
import Remove from 'in-websites/WebsiteDashboard/tabs/Configuration/Options/Remove';

export default function Options(props) {
  return (
    <>
      <Row>
        <Rename {...props} />
      </Row>
      <Row>
        <TrackingScript {...props} />
      </Row>
      <Row>
        <Remove {...props} />
      </Row>
    </>
  );
}
