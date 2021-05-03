/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import { SvgIcon } from '@instana/components';

import { alertRulesPropType, thresholdsPropType } from 'in-alerting/PotentialProblems/PotentialProblemsLane/proptypes';
import { getType } from 'in-alerting/PotentialProblems/PotentialProblemDialog/potentialProblemsDialogUtil';
import { getTitle } from 'in-alerting/PotentialProblems/textUtil';
import { Ul, Li } from 'in-new-components/lists/List';

import locals from 'in-alerting/PotentialProblems/PotentialProblemDialog/PotentialProblemsList.mless';

export default function PotentialProblemsList({ alerts, thresholds, alertRules, ...remainingProps }) {
  if (alerts.length === 0) return null;

  return (
    <Ul className={locals.list}>
      {alerts.map((alert, i) => {
        const rule = alertRules[alert.key].rule;
        const threshold = thresholds[alert.key];
        return (
          <PotentialProblemsListItem key={i} threshold={threshold} rule={rule} alert={alert} {...remainingProps} />
        );
      })}
    </Ul>
  );
}

function PotentialProblemsListItem({
  applicationLabel,
  serviceLabel,
  endpointLabel,
  rule,
  threshold,
  alert,
  onItemClick
}) {
  return (
    <Li className={locals.listItem} onClick={() => onItemClick(alert)}>
      <div className={locals.itemInnerWrapper}>
        <SvgIcon type="lib_application_trace" className={locals.icon} />
        <div>
          <div className={locals.itemName}>
            {endpointLabel ?? serviceLabel ?? applicationLabel} (
            <span className={locals.type}>{getType({ applicationLabel, serviceLabel, endpointLabel })}</span>)
          </div>
          <div className={locals.itemDescription}>{`${getTitle({ rule, threshold })}`}</div>
        </div>
      </div>
    </Li>
  );
}

PotentialProblemsList.propTypes = {
  alertRules: alertRulesPropType.isRequired,
  alerts: PropTypes.arrayOf(PropTypes.object).isRequired,
  thresholds: thresholdsPropType.isRequired
};
