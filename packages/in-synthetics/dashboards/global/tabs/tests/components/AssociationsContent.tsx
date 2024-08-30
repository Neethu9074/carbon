/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { TestResultListItem } from '@instana/types';

import AssociationsContentPresenter from 'in-synthetics/dashboards/global/tabs/tests/components/AssociationsContentPresenter';
import ApplicationLabelContent from 'in-synthetics/dashboards/global/tabs/tests/components/ApplicationLabelContent';
import { syntheticRbacLimitedEnabled } from 'in-services/featureFlags';

interface Props {
  item: TestResultListItem;
  shouldDisplayLink?: boolean;
}

const AssociationsContent = ({ item, shouldDisplayLink = true }: Props) => {
  if (syntheticRbacLimitedEnabled) {
    const applicationLabels = item?.testResultCommonProperties?.testCommonProperties?.applicationLabels ?? [];
    const applicationIds = item?.testResultCommonProperties?.testCommonProperties?.applicationIds ?? [];
    const websiteLabels = item?.testResultCommonProperties.testCommonProperties?.getWebsiteLabels ?? [];
    const websiteIds = item?.testResultCommonProperties.testCommonProperties?.websiteIds ?? [];
    const mobileAppLabels = item?.testResultCommonProperties.testCommonProperties?.mobileApplicationLabels ?? [];
    const mobileAppsIds = item?.testResultCommonProperties.testCommonProperties?.mobileApplicationIds ?? [];

    return (
      <AssociationsContentPresenter
        applicationIds={applicationIds}
        applicationLabels={applicationLabels}
        websiteIds={websiteIds}
        websiteLabels={websiteLabels}
        mobileAppIds={mobileAppsIds}
        mobileAppLabels={mobileAppLabels}
        shouldDisplayLink={shouldDisplayLink}
      />
    );
  }

  const applicationLabel = item.testResultCommonProperties?.testCommonProperties?.applicationLabel ?? '';
  const applicationId = item.testResultCommonProperties?.testCommonProperties?.applicationId ?? '';

  return (
    <ApplicationLabelContent
      applicationId={applicationId}
      applicationLabel={applicationLabel}
      shouldDisplayLink={shouldDisplayLink}
    />
  );
};

export default AssociationsContent;
