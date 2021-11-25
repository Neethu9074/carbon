/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import WebsiteGeoDetailRemoval from 'in-websites/WebsiteDashboard/tabs/Configuration/Options/WebsiteGeoDetailRemoval';
import WebsiteIpMasking from 'in-websites/WebsiteDashboard/tabs/Configuration/Options/WebsiteIpMasking';
import Row from 'in-websites/WebsiteDashboard/tabs/Configuration/Options/OptionsRow';

export interface Props {
  websiteId: string;
}

export default function Options(props: Props) {
  return (
    <>
      <Row>
        <WebsiteIpMasking {...props} />
      </Row>
      <Row>
        <WebsiteGeoDetailRemoval {...props} />
      </Row>
    </>
  );
}
