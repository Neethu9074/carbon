/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { SvgIcon, Button } from '@instana/components';

import { t } from 'in-i18n';

import locals from './ProgressInformation.mless';

export default function ProgressInformation({ getRedirectButtonProperties, isBackendAvailable, isAgentDeployed }) {
  const buttonProps = getRedirectButtonProperties();
  const progress = !isBackendAvailable ? 0 : isAgentDeployed ? 100 : 50;

  return (
    <div className={locals.wrapper}>
      <div className={locals.stepsWithProgressBar}>
        <div className={locals.steps}>
          <Step
            text={t('in-waiting-for-deployment:preparingInstance')}
            icon={isBackendAvailable ? 'lib_check' : 'lib_actions_loading'}
            spinning={!isBackendAvailable}
          />
          <div className={locals.stepSpacer} />
          <Step
            text={t('in-waiting-for-deployment:agentDeployed')}
            disabled={!isAgentDeployed}
            spinning={isBackendAvailable && !isAgentDeployed}
            icon={isBackendAvailable ? (isAgentDeployed ? 'lib_check' : 'lib_actions_loading') : 'lib_actions_settings'}
          />
        </div>
        <div className={locals.progressBarWrapper}>
          <div
            className={classNames({
              [locals.progressBar]: true,
              [locals[`progressBar${progress}`]]: true
            })}
          />
        </div>
      </div>
      <div className={locals.goToInstanceButtonCarbon}>
        <Button kind="tertiary" darkTheme icon="lib_arrow_expand_right" {...buttonProps} />
      </div>
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
