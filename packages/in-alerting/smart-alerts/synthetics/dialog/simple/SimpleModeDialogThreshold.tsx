/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field, MapForm } from 'formalistic';
import React from 'react';

import { DistinctSlider, SvgIcon } from '@instana/components';
import { themes } from '@instana/design-tokens';

import {
  AlertConfigDialogPresenterProps,
  MainDialogControl
} from 'in-alerting/smart-alerts/components/dialog/AlertConfigDialogPresenter';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/synthetics/dialog/simple/SimpleAlertConfigDialogStep3.mless';

export default function SimpleModeDialogThreshold(
  props: AlertConfigDialogPresenterProps &
    MainDialogControl & {
      subtitle?: string;
      subTitleToolTipText?: string;
    }
) {
  const formatLabel = (value: number) =>
    t('in-alerting:smartAlerts.synthetics.simple.slider.failuresWithCount', {
      count: value
    });

  const labeledTicks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(value => ({ value, label: value }));
  const { form, updateForm, subtitle, subTitleToolTipText } = props;
  const timeThresholdForm = form.get('timeThreshold') as MapForm<any>;
  const violationsCount = (timeThresholdForm.get('violationsCount') as Field<number>).value;

  function onChangeViolationsInPeriod(_event: Event, value: number | number[]) {
    //@ts-expect-error
    updateForm(form.updateIn(['timeThreshold', 'violationsCount'], f => f.setValue(value).setTouched(true)));
  }
  return (
    <>
      {subtitle && (
        <div className={locals.subtitle}>
          {subtitle}
          {subTitleToolTipText && (
            <Tooltip align="bottomMiddle" content={subTitleToolTipText}>
              <SvgIcon type="lib_help_error_help_outline" color={themes.default.ids.color.option.neutral['600']} />
            </Tooltip>
          )}
        </div>
      )}
      <div className={locals.container}>
        <DistinctSlider
          valueLabelFormat={formatLabel}
          marks={labeledTicks}
          min={1}
          max={10}
          step={1}
          value={violationsCount}
          onChange={onChangeViolationsInPeriod}
        />
      </div>
    </>
  );
}
