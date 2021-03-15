/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-disable no-console */
import React, { useState } from 'react';

import OnboardingWidgetPresenter from 'in-waiting-for-deployment/components/OnboardingWidget/OnboardingWidgetPresenter';
import TooltipPresenter from 'in-components/Tooltip/TooltipPresenter';
import DialogPresenter from 'in-components/DialogPresenter';

export default {
  title: 'Templates|selfService/GroupOnboardingWidget',
  component: OnboardingWidgetPresenter
};

export function WithoutBackend() {
  return (
    <Wrapper
      isBackendAvailable={false}
      isRestricted
      getRedirectButtonProperties={() => ({
        disabled: true,
        children: 'Sign in to Instana'
      })}
    />
  );
}
export function WithBackendBeforeRedirect() {
  return (
    <Wrapper
      isBackendAvailable
      isRestricted
      getRedirectButtonProperties={() => ({
        disabled: false,
        href: 'https://foo.bar',
        children: 'Sign in to Instana'
      })}
    />
  );
}
export function WithBackendAfterRedirect() {
  return (
    <Wrapper
      isBackendAvailable
      getRedirectButtonProperties={() => ({
        disabled: true,
        children: 'Go to Instana!'
      })}
    />
  );
}
export function WithDeployedAgent() {
  return (
    <Wrapper
      isBackendAvailable
      isAgentDeployed
      getRedirectButtonProperties={() => ({
        disabled: false,
        onClick: () => console.log('CLICKED'),
        children: 'Go to Instana!'
      })}
    />
  );
}

function Wrapper(props) {
  const [selectedEntryIndex, onEntrySelected] = useState(0);
  const [selectedSubEntryIndex, onSubEntrySelected] = useState(undefined);

  return (
    <>
      <DialogPresenter />
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          padding: '2rem 4rem',
          background: '#595959'
        }}
      >
        <OnboardingWidgetPresenter
          {...props}
          agentKey="7550eeca-f0eb-4039-b87a-c3fbd0d"
          tenant="instana"
          tenantUnit="test"
          region="us-west-2"
          selectedEntryIndex={selectedEntryIndex}
          onEntrySelected={index => {
            onEntrySelected(index);
            onSubEntrySelected(undefined);
          }}
          selectedSubEntryIndex={selectedSubEntryIndex}
          onSubEntrySelected={onSubEntrySelected}
        />
      </div>
      <TooltipPresenter />
    </>
  );
}
