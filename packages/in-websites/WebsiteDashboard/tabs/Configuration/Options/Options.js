/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';

import TrackingScript from 'in-websites/WebsiteDashboard/tabs/Configuration/Options/TrackingScript';
import Rename from 'in-websites/WebsiteDashboard/tabs/Configuration/Options/Rename';
import Remove from 'in-websites/WebsiteDashboard/tabs/Configuration/Options/Remove';

import locals from './Options.mless';

export default function Options(props) {
  return (
    <Fragment>
      <Row>
        <Rename {...props} />
      </Row>
      <Row>
        <TrackingScript {...props} />
      </Row>
      <Row>
        <Remove {...props} />
      </Row>
    </Fragment>
  );
}

function Row({ children }) {
  return <div className={locals.row}>{children}</div>;
}
