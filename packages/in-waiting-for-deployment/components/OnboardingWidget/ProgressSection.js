/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ProgressInformation from 'in-waiting-for-deployment/components/OnboardingWidget/ProgressInformation';
import StanImage from 'in-new-components/StanImage/StanImage';

import locals from './ProgressSection.mless';

export default function ProgressSection(props) {
  return (
    <div className={locals.section}>
      <div className={locals.leftContent}>
        <div className={locals.stanWrapper}>
          <StanImage className={locals.stan} />
        </div>
        <div>{getText(props)}</div>
      </div>

      <ProgressInformation {...props} />
    </div>
  );
}

function getText({ isBackendAvailable, isAgentDeployed }) {
  if (isAgentDeployed) {
    return (
      <>
        <span className={locals.description}>Agents are reporting. Data is being collected.</span>
        <br />
        <span className={locals.description}>Time to explore Instana!</span>
      </>
    );
  }
  if (isBackendAvailable) {
    return (
      <>
        <span className={locals.description}>Your Instana instance is ready, and works best with lots of data.</span>
        <br />
        <span className={locals.description}>{`Let's`} get some agents running…</span>
      </>
    );
  }
  return (
    <>
      <span className={locals.description}>While we are preparing your instana instance,</span>
      <br />
      <span className={locals.description}>get ready to deploy Agents in your environment…</span>
    </>
  );
}
