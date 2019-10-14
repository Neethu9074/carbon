import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import Button from 'in-new-components/Button';
import SvgIcon from 'in-components/SvgIcon';

import locals from './ProgressInformation.mless';

export default function ProgressInformation({ getRedirectButtonProperties, isBackendAvailable, isAgentDeployed }) {
  const buttonProps = getRedirectButtonProperties();
  const progress = !isBackendAvailable ? 0 : isAgentDeployed ? 100 : 50;

  return (
    <div className={locals.wrapper}>
      <div className={locals.stepsWithProgressBar}>
        <div className={locals.steps}>
          <Step
            text="Preparing instance"
            icon={isBackendAvailable ? 'lib_check' : 'lib_actions_loading'}
            spinning={!isBackendAvailable}
          />
          <div className={locals.stepSpacer} />
          <Step
            text="1 Agent deployed"
            disabled={!isBackendAvailable}
            icon={isAgentDeployed ? 'lib_check' : 'lib_actions_settings'}
          />
        </div>
        <div className={locals.progressBarWrapper}>
          <div
            className={evaluateClassNames({
              [locals.progressBar]: true,
              [locals[`progressBar${progress}`]]: true
            })}
          />
        </div>
      </div>

      <Button
        style={{ opacity: buttonProps.disabled ? 0.5 : 1 }}
        className={locals.goToInstanceButton}
        kind="secondary"
        icon="lib_arrow_expand_right"
        {...buttonProps}
      />
    </div>
  );
}

function Step({ icon, text, spinning, disabled }) {
  return (
    <div style={{ opacity: disabled ? 0.5 : 1 }} className={locals.step}>
      <SvgIcon className={locals.icon} type={icon} size="l" spinning={spinning} />
      <span className={locals.stepText}>{text}</span>
    </div>
  );
}
