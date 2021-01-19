/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import OnboardingWidget from 'in-waiting-for-deployment/components/OnboardingWidget/OnboardingWidget';
import FullViewWrapper from 'in-waiting-for-deployment/components/FullViewWrapper';

import locals from './FullViewOnboardingWidget.mless';

export default function FullViewOnboardingWidget(props) {
  return (
    <FullViewWrapper>
      <div className={locals.maxWidth}>
        <OnboardingWidget {...props} />
      </div>
    </FullViewWrapper>
  );
}
