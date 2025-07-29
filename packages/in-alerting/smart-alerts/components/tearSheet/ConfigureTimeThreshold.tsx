/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { MapForm, Item, MapPath } from 'formalistic';
import React from 'react';

import {
  getMarksForThresholdType,
  getDefaultMark
} from 'in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/ConfigureGranularity';
import TimeThresholdViolationsInSequence from 'in-alerting/smart-alerts/components/tearSheet/TimeThresholdConfig/TimeThresholdViolationsInSequence';
import TimeThresholdViolationsInPeriod from 'in-alerting/smart-alerts/components/tearSheet/TimeThresholdConfig/TimeThresholdViolationsInPeriod';
import {
  timeThresholdTypes,
  TimeThresholdType
} from 'in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/formData';
import ConfigureUserImpact from 'in-alerting/smart-alerts/components/tearSheet/TimeThresholdConfig/ConfigureUserImpact';
import TraceImpact from 'in-alerting/smart-alerts/components/tearSheet/TimeThresholdConfig/TraceImpact';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/tearSheet/ConfigureTimeThreshold.mless';

interface ConfigureTimeThresholdProps {
  form: MapForm<any>;
  onChange: (path: MapPath<any>, updater: (item: Item) => Item) => void;
  updateForm: (form: MapForm<any>) => void;
}

export interface Marks {
  label: string;
  millis: number;
  value: number;
}

export default function ConfigureTimeThreshold({ form, onChange, updateForm }: ConfigureTimeThresholdProps) {
  const granularity = form.get('granularity')?.value;
  const thresholdType = form.get('threshold').get('warningThreshold').get('type')?.value;
  const timeThresholdForm = form.get('timeThreshold');
  const timeThresholdType = timeThresholdForm.get('type')?.value;

  const marks = getMarksForThresholdType(thresholdType);
  const foundMark = marks.find((i: Marks) => i.millis === granularity) ?? getDefaultMark(marks, thresholdType);
  const granularityInMinutes = foundMark.value;

  if (timeThresholdType === timeThresholdTypes.violationsInSequence) {
    return (
      <div className={locals.timeWindowInputContainer}>
        <TimeThresholdViolationsInSequence
          form={form}
          updateForm={updateForm}
          label={t('in-alerting:smartAlerts.components.tearSheet.timeThreshold.numberOfConsecutiveViolationsLabel', {
            granularity: granularityInMinutes
          })}
          isCustomInputStyle
        />
      </div>
    );
  }

  if (timeThresholdType === timeThresholdTypes.violationsInPeriod) {
    return (
      <div className={locals.timeWindowInputContainer}>
        <TimeThresholdViolationsInPeriod form={form} updateForm={updateForm} />
      </div>
    );
  }

  if (timeThresholdType === timeThresholdTypes.traceImpact) {
    return (
      <div className={locals.timeWindowInputContainer}>
        <TraceImpact form={form} updateForm={updateForm} isCustomInputStyle />
      </div>
    );
  }

  return (
    <div className={locals.alertThresholdConfigContainer}>{getConfigureViolationsOrUserImpact(timeThresholdType)}</div>
  );

  function getConfigureViolationsOrUserImpact(timeThresholdType: TimeThresholdType) {
    if (timeThresholdType === timeThresholdTypes.userImpactOfViolationsInSequence) {
      return <ConfigureUserImpact form={form} onChange={onChange} updateForm={updateForm} />;
    } else {
      return null;
    }
  }
}
