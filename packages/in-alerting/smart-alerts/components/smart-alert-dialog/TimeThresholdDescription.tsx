/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { SvgIcon } from '@instana/components';

import { timeThresholdLabels } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/TimeThresholdConfig/formData';
import { timeThresholdTypes } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/TimeThresholdConfig/formData';
import { getDescription } from 'in-alerting/smart-alerts/components/smart-alert-dialog/timeThresholdDescriptionText';
import { ApplicationTimeThreshold, WebsiteTimeThreshold } from 'in-types';

import locals from './TimeThresholdDescription.mless';

interface TimeThresholdDescriptionProps {
  granularity?: number;
  timeThreshold: WebsiteTimeThreshold | ApplicationTimeThreshold;
}
export default function TimeThresholdDescription({ timeThreshold, granularity = 1 }: TimeThresholdDescriptionProps) {
  return (
    <div className={locals.container}>
      <SvgIcon className={locals.icon} type={getIconType(timeThreshold.type)} />
      <div>
        <span className={locals.label}>
          {
            // @ts-expect-error at the moment timeThreshold.type is just a string instead of a TimeThresholdType.
            // after that will be changed in the backend -> type generation we can remove this
            // statement. Alternatively do some switch/case workaround like getIconType()
            timeThresholdLabels[timeThreshold.type]
          }
        </span>
        <p>{getDescription(timeThreshold, granularity)}</p>
      </div>
    </div>
  );
}

function getIconType(timeThresholdType: string) {
  switch (timeThresholdType) {
    case timeThresholdTypes.userImpactOfViolationsInSequence:
      return 'lib_alerts_user_impacted';
    case timeThresholdTypes.requestImpact:
      return 'lib_application_boundary_inbound_calls';
    case timeThresholdTypes.violationsInPeriod:
      return 'lib_alerting_threshold_icon';
    case timeThresholdTypes.violationsInSequence:
    default:
      return 'lib_datetime_timerange';
  }
}
