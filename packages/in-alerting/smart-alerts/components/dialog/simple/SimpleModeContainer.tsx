/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import MessageStack, { MessageType } from 'in-components/MessageStack/MessageStack';
import { StepConfigs } from 'in-components/BlueprintFormMultistep/StepConfigs';
import StepProgressBar from 'in-components/StepProgressBar';

import locals from 'in-alerting/smart-alerts/components/dialog/simple/SimpleModeContainer.mless';

export interface SimpleModeContainerProps {
  step: number;
  stepConfigs: StepConfigs;
  stepRenderers: ((props?: SimpleModeContainerProps) => React.ReactNode)[];
  messages: MessageType[];
}

export default function SimpleModeContainer(props: SimpleModeContainerProps) {
  const { stepConfigs, stepRenderers, step, messages } = props;

  return (
    <div className={locals.container}>
      {stepRenderers.map(
        (renderer, idx) =>
          step === idx && (
            <div className={locals.scrollWrapper} key={idx}>
              <StepProgressBar stepTitles={mapTitles(stepConfigs)} step={step} />
              <div className={locals.minStableHeight}>
                {/* need to wrap this with an additional element, because
                 a shared component used here is using 100% height of the parent. */
                renderer(props)}
              </div>
            </div>
          )
      )}

      <MessageStack className={locals.errorInfo} messages={messages} />
    </div>
  );
}

function mapTitles(stepConfigs: StepConfigs) {
  return stepConfigs.map(stepConfig => stepConfig.title);
}
