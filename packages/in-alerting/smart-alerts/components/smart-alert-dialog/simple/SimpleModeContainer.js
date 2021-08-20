/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter';
import StepProgressBar from 'in-components/StepProgressBar';

import locals from 'in-alerting/smart-alerts/components/smart-alert-dialog/simple/SimpleModeContainer.mless';

export default function SimpleModeContainer(props) {
  const { stepConfigs, stepRenderers, step, error } = props;

  return (
    <div className={locals.container}>
      <>
        <StepProgressBar stepTitles={mapTitles(stepConfigs)} step={step} />

        <div className={locals.form}>{stepRenderers[step](props)}</div>

        {error && <ErroneousResultPresenter errors={[error]} className={locals.errorInfo} />}
      </>
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
  error: PropTypes.object
};
