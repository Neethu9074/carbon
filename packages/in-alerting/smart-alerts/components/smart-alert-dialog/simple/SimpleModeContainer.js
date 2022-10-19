/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import { SmartAlertErrorMessages } from 'in-alerting/smart-alerts/components/smart-alert-dialog/components/SmartAlertErrorMessages';
import StepProgressBar from 'in-components/StepProgressBar';

import locals from 'in-alerting/smart-alerts/components/smart-alert-dialog/simple/SimpleModeContainer.mless';

export default function SimpleModeContainer(props) {
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

      <SmartAlertErrorMessages className={locals.errorInfo} messages={messages} />
    </div>
  );
}

function mapTitles(stepConfigs) {
  return stepConfigs.map(stepConfig => stepConfig.title);
}

SimpleModeContainer.propTypes = {
  step: PropTypes.number.isRequired,
  stepConfigs: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      validateIntermediately: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string))
    })
  ).isRequired,
  stepRenderers: PropTypes.arrayOf(PropTypes.func).isRequired,
  messages: PropTypes.arrayOf(PropTypes.object).isRequired
};
