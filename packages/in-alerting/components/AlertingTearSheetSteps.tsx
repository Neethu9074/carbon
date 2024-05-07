/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { Dispatch, SetStateAction } from 'react';
import { MapForm } from 'formalistic';
import classNames from 'classnames';

import { Spacer, SvgIcon, Typography } from '@instana/components';
import { themes } from '@instana/design-tokens';

import { AlertingTearSheetStepConfigs } from 'in-alerting/components/AlertingTearSheet';
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
        <>
          <div
            className={classNames({
              [locals.label]: true,
              [locals.selected]: idx === step
            })}
            onClick={() => setStep(idx)}
            key={idx}
          >
            <Typography variant="body-regular">
              <span className={locals.twoColumns}>
                <span className={locals.inline}>
                  <span className={locals.index}>{`${idx + 1}.`} </span>
                  <Spacer horizontal="xsmall" />
                  {stepConfig.title}
                </span>

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
                <Typography variant="body-small">
                  <span
                    className={classNames({
                      [locals.lightColor]: idx === step,
                      [locals.color600]: idx !== step
                    })}
                  >
                    {t('in-alerting:components.optional')}
                  </span>
                </Typography>
              </span>
            )}
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
