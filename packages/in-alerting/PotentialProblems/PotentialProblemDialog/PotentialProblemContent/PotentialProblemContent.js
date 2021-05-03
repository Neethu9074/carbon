/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import { SvgIcon } from '@instana/components';

import PotentialProblemContentControls from 'in-alerting/PotentialProblems/PotentialProblemDialog/PotentialProblemContent/PotentialProblemContentControls';
import PotentialProblemChart from 'in-alerting/PotentialProblems/PotentialProblemDialog/PotentialProblemContent/PotentialProblemChart';
import {
  getIconByType,
  getType
} from 'in-alerting/PotentialProblems/PotentialProblemDialog/potentialProblemsDialogUtil';
import { alertPropType, rulePropType } from 'in-alerting/PotentialProblems/PotentialProblemsLane/proptypes';
import { getDescription, getTitle } from 'in-alerting/PotentialProblems/textUtil';
import { formatDateTime } from 'in-services/formatters/date';

import locals from 'in-alerting/PotentialProblems/PotentialProblemDialog/PotentialProblemContent/PotentialProblemContent.mless';

export default function PotentialProblemContent({
  alert,
  applicationLabel,
  serviceLabel,
  endpointLabel,
  rule,
  threshold,
  ...remainingProps
}) {
  const alertType = rule.alertType;
  const type = getType({ applicationLabel, serviceLabel, endpointLabel });

  return (
    <div className={locals.container}>
      <div className={locals.contentHeader}>
        <div className={locals.headline}>{getTitle({ rule, threshold })}</div>
        <div className={locals.entity}>
          <SvgIcon size="s" className={locals.icon} type={getIconByType(type)} />
          {getLabelText({
            applicationLabel,
            serviceLabel,
            endpointLabel
          })}
        </div>
        <div className={locals.duration}>
          <SvgIcon size="xs" className={locals.icon} type="lib_datetime_time" />
          <time dateTime={new Date(alert.start).toISOString()}>{formatDateTime(alert.start)}</time>
          <div className={locals.durationDevider}>—</div>
          <time dateTime={new Date(alert.end).toISOString()}>{formatDateTime(alert.end)}</time>
        </div>
        <div className={locals.description}>{getDescription({ rule, threshold, alertType })}</div>
      </div>
      <div className={locals.chartWrapper}>
        <PotentialProblemChart
          {...remainingProps}
          rule={rule}
          threshold={threshold}
          alert={alert}
          alertType={alertType}
        />
      </div>
      <div className={locals.controls}>
        <PotentialProblemContentControls
          {...remainingProps}
          applicationLabel={applicationLabel}
          rule={rule}
          threshold={threshold}
          alert={alert}
        />
      </div>
    </div>
  );
}

function getLabelText({ applicationLabel, serviceLabel, endpointLabel }) {
  const Icon = <SvgIcon size="xs" className={locals.icon} type="lib_arrow_expand_right" />;
  return (
    <>
      {applicationLabel}{' '}
      {serviceLabel ? (
        <>
          {Icon}
          {serviceLabel}
        </>
      ) : null}{' '}
      {endpointLabel ? (
        <>
          {Icon}
          {endpointLabel}
        </>
      ) : null}
    </>
  );
}

PotentialProblemContent.propTypes = {
  alert: alertPropType.isRequired,
  applicationLabel: PropTypes.string.isRequired,
  endpointLabel: PropTypes.string,
  rule: rulePropType.isRequired,
  serviceLabel: PropTypes.string,
  threshold: PropTypes.object.isRequired
};
