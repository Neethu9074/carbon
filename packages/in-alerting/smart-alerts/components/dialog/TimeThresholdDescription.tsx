/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { SvgIcon, Stack } from '@instana/components';

import { timeThresholdLabels } from 'in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/formData';
import { timeThresholdTypes } from 'in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/formData';
import { getDescription } from 'in-alerting/smart-alerts/components/dialog/timeThresholdDescriptionText';
import { ApplicationTimeThreshold, WebsiteTimeThreshold, InfraTimeThreshold } from 'in-types';

import locals from './TimeThresholdDescription.mless';

interface TimeThresholdDescriptionProps {
  granularity?: number;
  timeThreshold: WebsiteTimeThreshold | ApplicationTimeThreshold | InfraTimeThreshold;
}
export default function TimeThresholdDescription({ timeThreshold, granularity = 1 }: TimeThresholdDescriptionProps) {
  return (
    <Stack direction="horizontal" align="center" gap="disabled">
      <SvgIcon className={locals.icon} type={getIconType(timeThreshold.type)} />
      <Stack gap="disabled">
        <div className={locals.label}>{timeThresholdLabels[timeThreshold.type]}</div>
        <div>{getDescription(timeThreshold, granularity)}</div>
      </Stack>
    </Stack>
  );
}

function getIconType(timeThresholdType: string) {
  switch (timeThresholdType) {
    case timeThresholdTypes.userImpactOfViolationsInSequence:
      return 'lib_alerts_user_impacted';
    case timeThresholdTypes.traceImpact:
      return 'lib_application_boundary_inbound_calls';
    case timeThresholdTypes.violationsInPeriod:
      return 'lib_alerting_threshold_icon';
    case timeThresholdTypes.violationsInSequence:
    default:
      return 'lib_datetime_timerange';
  }
}
