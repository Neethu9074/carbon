/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';

import { TestResultListItem } from '@instana/types';

import AssociationsContentPresenter from 'in-synthetics/dashboards/global/tabs/tests/components/AssociationsContentPresenter';
import ApplicationLabelContent from 'in-synthetics/dashboards/global/tabs/tests/components/ApplicationLabelContent';
import { AssociationsSidePanel } from 'in-synthetics/dashboards/global/tabs/tests/components/AssociationsSidePanel';
import { syntheticCarbonTableEnabled, syntheticRbacLimitedEnabled } from 'in-services/featureFlags';
import { t } from 'in-i18n';

interface Props {
  item: TestResultListItem;
  shouldDisplayLink?: boolean;
}

const AssociationsContent = ({ item, shouldDisplayLink }: Props) => {
  const [associationsSidePanelOpen, setAssociationsSidePanelOpen] = useState(false);
  const applicationIdsCanBeLinked =
    shouldDisplayLink == undefined
      ? item?.testResultCommonProperties?.testCommonProperties?.accessScopeApplicationIds ?? []
      : [];
  if (syntheticRbacLimitedEnabled) {
    const applicationLabels = item?.testResultCommonProperties?.testCommonProperties?.applicationLabels ?? [];
    const applicationIds = item?.testResultCommonProperties?.testCommonProperties?.applicationIds ?? [];
    const websiteLabels = item?.testResultCommonProperties?.testCommonProperties?.getWebsiteLabels ?? [];
    const websiteIds = item?.testResultCommonProperties?.testCommonProperties?.websiteIds ?? [];
    const mobileAppLabels = item?.testResultCommonProperties?.testCommonProperties?.mobileApplicationLabels ?? [];
    const mobileAppIds = item?.testResultCommonProperties?.testCommonProperties?.mobileApplicationIds ?? [];
    const websiteIdsCanBeLinked =
      shouldDisplayLink == undefined
        ? item?.testResultCommonProperties?.testCommonProperties?.accessScopeWebsiteIds ?? []
        : [];
    const mobileAppIdsCanBeLinked =
      shouldDisplayLink == undefined
        ? item?.testResultCommonProperties?.testCommonProperties?.accessScopeMobileApplicationIds ?? []
        : [];
    const numberOfAssociations: number = applicationLabels.length + websiteLabels.length + mobileAppLabels.length;

    return syntheticCarbonTableEnabled ? (
      <AssociationsSidePanel
        associationsSidePanelOpen={associationsSidePanelOpen}
        setAssociationsSidePanelOpen={setAssociationsSidePanelOpen}
        associationsColumnText={
          numberOfAssociations === 1
            ? t('in-synthetics:dashboard.testList.multiAppDialog.singleAppHeader', {
                number: numberOfAssociations
              })
            : t('in-synthetics:dashboard.testList.multiAppDialog.multiAppHeader', {
                number: numberOfAssociations
              })
        }
        applicationLabels={applicationLabels}
        websiteLabels={websiteLabels}
        mobileAppLabels={mobileAppLabels}
        applicationIds={applicationIds}
        websiteIds={websiteIds}
        mobileAppIds={mobileAppIds}
        applicationIdsCanBeLinked={applicationIdsCanBeLinked}
        websiteIdsCanBeLinked={websiteIdsCanBeLinked}
        mobileAppIdsCanBeLinked={mobileAppIdsCanBeLinked}
      />
    ) : (
      <AssociationsContentPresenter
        applicationIds={applicationIds}
        applicationLabels={applicationLabels}
        websiteIds={websiteIds}
        websiteLabels={websiteLabels}
        mobileAppIds={mobileAppIds}
        mobileAppLabels={mobileAppLabels}
        applicationIdsCanBeLinked={applicationIdsCanBeLinked}
        websiteIdsCanBeLinked={websiteIdsCanBeLinked}
        mobileAppIdsCanBeLinked={mobileAppIdsCanBeLinked}
      />
    );
  }

  const applicationLabel = item.testResultCommonProperties?.testCommonProperties?.applicationLabel ?? '';
  const applicationId = item.testResultCommonProperties?.testCommonProperties?.applicationId ?? '';
  shouldDisplayLink = shouldDisplayLink == undefined ? applicationIdsCanBeLinked.includes(applicationId) : false;

  return (
    <ApplicationLabelContent
      applicationId={applicationId}
      applicationLabel={applicationLabel}
      shouldDisplayLink={shouldDisplayLink}
    />
  );
};

export default AssociationsContent;
