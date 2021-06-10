/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import ApplicationScopePath from 'in-alerting/smart-alerts/applications/components/ApplicationScopePath';
import useApplicationLabel from 'in-alerting/smart-alerts/applications/hooks/useApplicationLabel';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';

export function ShowApplicationSelection({ applicationId }) {
  const applicationName = useApplicationLabel(applicationId, false);
  return (
    <HorizontalFlexWrapper>
      <ApplicationScopePath applicationName={applicationName} applicationId={applicationId} noBottomMargin />
    </HorizontalFlexWrapper>
  );
}
