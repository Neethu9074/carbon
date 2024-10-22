/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import AssociationsContentPresenter from 'in-synthetics/dashboards/global/tabs/tests/components/AssociationsContentPresenter';
import { SyntheticCredential } from 'in-types';

const CredentialAssociationsContent = ({ item }: { item: SyntheticCredential }) => {
  const applicationLabels = item?.applicationLabels ?? [];
  const applicationIds = item?.applications ?? [];
  const websiteLabels = item?.websiteLabels ?? [];
  const websiteIds = item?.websites ?? [];
  const mobileAppLabels = item?.mobileAppLabels ?? [];
  const mobileAppsIds = item?.mobileApps ?? [];

  return (
    <AssociationsContentPresenter
      applicationIds={applicationIds}
      applicationLabels={applicationLabels}
      websiteIds={websiteIds}
      websiteLabels={websiteLabels}
      mobileAppIds={mobileAppsIds}
      mobileAppLabels={mobileAppLabels}
      applicationIdsCanBeLinked={applicationIds}
      websiteIdsCanBeLinked={websiteIds}
      mobileAppIdsCanBeLinked={mobileAppsIds}
    />
  );
};

export default CredentialAssociationsContent;
