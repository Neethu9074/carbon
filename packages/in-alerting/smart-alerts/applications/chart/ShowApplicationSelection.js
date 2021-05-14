/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';

import ApplicationScopePath from 'in-alerting/smart-alerts/applications/components/ApplicationScopePath';
import HorizontalFlexWrapper from 'in-new-components/layout/HorizontalFlexWrapper';
import getApplication from 'in-subscription/application/getApplication';

export function ShowApplicationSelection(props) {
  const { applicationId } = props;
  const applicationName = useObservable(
    applicationId ? getApplication({ id: applicationId }).map(({ data }) => data && data.label) : just(null),
    [applicationId]
  );
  return (
    <HorizontalFlexWrapper>
      <ApplicationScopePath applicationName={applicationName} applicationId={applicationId} noBottomMargin />
    </HorizontalFlexWrapper>
  );
}
