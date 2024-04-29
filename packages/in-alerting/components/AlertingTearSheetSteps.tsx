/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { Dispatch, SetStateAction } from 'react';
import classNames from 'classnames';

import { Spacer, Typography } from '@instana/components';

import { AlertingTearSheetStepConfigs } from 'in-alerting/components/AlertingTearSheet';
import { t } from 'in-i18n';

import locals from './AlertingTearSheetSteps.mless';

export default function AlertingTearSheetSteps(props: {
  stepConfigs: AlertingTearSheetStepConfigs[];
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
}) {
  const { stepConfigs, step, setStep } = props;

  return (
    <div className={locals.rightSeparator}>
      {stepConfigs.map((stepConfig: AlertingTearSheetStepConfigs, idx: number) => (
        <>
          <div
            className={classNames({
              [locals.label]: true,
              [locals.flexColumn]: stepConfig.isOptional,
              [locals.selected]: idx === step
            })}
            onClick={() => setStep(idx)}
            key={idx}
          >
            <Typography variant="body-regular">
              <span className={locals.inline}>
                <span className={locals.index}>{`${idx + 1}.`} </span>
                <Spacer horizontal="xsmall" />
                {stepConfig.title}
              </span>
            </Typography>
            {stepConfig.isOptional && <p className={locals.optional}>{t('in-alerting:components.optional')}</p>}
          </div>

          <div
            className={classNames({
              [locals.tabSelected]: idx === step
            })}
          />
        </>
      ))}
    </div>
  );
}
