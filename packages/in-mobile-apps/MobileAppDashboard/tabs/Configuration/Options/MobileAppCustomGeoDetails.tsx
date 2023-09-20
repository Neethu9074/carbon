/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import CustomGeoDetails from 'in-websites/WebsiteDashboard/tabs/Configuration/Options/CustomGeoDetails/CustomGeoDetails';

export interface Props {
  mobileAppId: string;
}

export default function MobileAppCustomGeoDetails({ mobileAppId }: Props) {
  return (
    <CustomGeoDetails
      apiUrl={`/api/mobile-app-monitoring/config/${encodeURIComponent(mobileAppId)}/geo-mapping-rules`}
      documentationUrl="https://ibm.biz/custom-geographic-details"
    />
  );
}
