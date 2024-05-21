/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { Dispatch, SetStateAction } from 'react';
import { MapForm } from 'formalistic';
import classNames from 'classnames';

import { SvgIcon, Typography } from '@instana/components';
import { themes } from '@instana/design-tokens';

import { AlertingTearSheetStepConfigs } from 'in-alerting/components/AlertingTearSheet';
import AlertTypography from 'in-alerting/components/AlertTypography';
import { t } from 'in-i18n';

import locals from './AlertingTearSheetSteps.mless';

export default function AlertingTearSheetSteps(props: {
  stepConfigs: AlertingTearSheetStepConfigs[];
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
  form: MapForm<any>;
}) {
  const { stepConfigs, step, setStep, form } = props;
  const displayValidation = form && !form.hierarchyValid && form.touched;
  return (
    <div className={locals.rightSeparator}>
      {stepConfigs.map((stepConfig: AlertingTearSheetStepConfigs, idx: number) => (
        <span key={idx}>
          <div
            className={classNames({
              [locals.label]: true,
              [locals.selected]: idx === step
            })}
            onClick={() => setStep(idx)}
            key={idx}
          >
            <Typography variant="body-regular">
              <span className={locals.threeColumns}>
                <span className={classNames({ [locals.color600]: idx !== step, [locals.index]: true })}>
                  {`${idx + 1}.`}
                </span>
                <span className={classNames({ [locals.color600]: idx !== step })}>{stepConfig.title}</span>
                {displayValidation && !stepConfig?.valid && (
                  <span className={locals.alignIcon}>
                    <SvgIcon
                      type={'lib_help_error_error_circle'}
                      color={themes.default.ids.color.option.red['500']}
                      size={'s'}
                    />
                  </span>
                )}
              </span>
            </Typography>
            {stepConfig.isOptional && (
              <span className={locals.optional}>
                <AlertTypography variant={'body-small'} content={t('in-alerting:components.optional')} noMargin />
              </span>
            )}
          </div>

          <div
            className={classNames({
              [locals.tabSelected]: idx === step
            })}
          />
        </span>
      ))}
    </div>
  );
}
