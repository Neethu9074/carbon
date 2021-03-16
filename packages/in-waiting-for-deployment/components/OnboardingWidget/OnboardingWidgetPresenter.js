/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import InstallDocumentation from 'in-waiting-for-deployment/components/OnboardingWidget/InstallDocumentation';
import ProgressSection from 'in-waiting-for-deployment/components/OnboardingWidget/ProgressSection';
import InfoSection from 'in-waiting-for-deployment/components/OnboardingWidget/InfoSection';

import locals from './OnboardingWidgetPresenter.mless';

export default function OnboardingWidgetPresenter(props) {
  return (
    <div className={locals.wrapper}>
      <InstallDocumentation {...props} />
      <ProgressSection {...props} />
      <InfoSection {...props} />
    </div>
  );
}
