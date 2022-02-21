/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import CustomGeoDetails from 'in-websites/WebsiteDashboard/tabs/Configuration/Options/CustomGeoDetails/CustomGeoDetails';

export interface Props {
  websiteId: string;
}

export default function WebsiteCustomGeoDetails({ websiteId }: Props) {
  return (
    <CustomGeoDetails
      apiUrl={`/api/website-monitoring/config/${encodeURIComponent(websiteId)}/geo-mapping-rules`}
      documentationUrl="https://www.ibm.com/docs/en/obi/current?topic=websites-custom-geographic-details"
    />
  );
}
