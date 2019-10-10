/* eslint-disable no-console */
import { storiesOf } from '@storybook/react';
import React, { useState } from 'react';

import OnboardingWidgetPresenter from 'in-waiting-for-deployment/components/OnboardingWidget/OnboardingWidgetPresenter';
import TooltipPresenter from 'in-components/Tooltip/TooltipPresenter';
import DialogPresenter from 'in-components/DialogPresenter';

export default {
  title: 'Self Service/Onboarding Widget',
  component: OnboardingWidgetPresenter
};

storiesOf('Self Service/Onboarding Widget', module)
  .addParameters({ component: OnboardingWidgetPresenter })
  .add('without backend', () => (
    <Wrapper
      isBackendAvailable={false}
      isRestricted
      getRedirectButtonProperties={() => ({
        disabled: true,
        children: 'Sign in to Instana'
      })}
    />
  ))
  .add('with backend before redirect', () => (
    <Wrapper
      isBackendAvailable
      isRestricted
      getRedirectButtonProperties={() => ({
        disabled: false,
        href: 'https://foo.bar',
        children: 'Sign in to Instana'
      })}
    />
  ))
  .add('with backend after redirect', () => (
    <Wrapper
      isBackendAvailable
      getRedirectButtonProperties={() => ({
        disabled: true,
        children: 'Go to Instana!'
      })}
    />
  ))
  .add('with deployed agent', () => (
    <Wrapper
      isBackendAvailable
      isAgentDeployed
      getRedirectButtonProperties={() => ({
        disabled: false,
        onClick: () => console.log('CLICKED'),
        children: 'Go to Instana!'
      })}
    />
  ));

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
