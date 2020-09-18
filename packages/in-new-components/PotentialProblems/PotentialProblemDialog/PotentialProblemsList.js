import PropTypes from 'prop-types';
import React from 'react';

import { getType } from 'in-new-components/PotentialProblems/PotentialProblemDialog/potentialProblemsDialogUtil';
import { getTitle } from 'in-new-components/PotentialProblems/textUtil';
import { Ul, Li } from 'in-new-components/lists/List/List';
import SvgIcon from 'in-components/SvgIcon';

import locals from './PotentialProblemsList.mless';

export default function PotentialProblemsList({ alerts, alertConfig, ...remainingProps }) {
  if (alerts.length === 0) return null;
  return (
    <Ul className={locals.list}>
      {alerts.map((alert, i) => {
        return (
          <PotentialProblemsListItem key={i} alertConfig={alertConfig[alert.key]} alert={alert} {...remainingProps} />
        );
      })}
    </Ul>
  );
}

function PotentialProblemsListItem({ applicationLabel, serviceLabel, endpointLabel, alertConfig, alert, onItemClick }) {
  const { rule, threshold } = alertConfig;
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
  alertConfig: PropTypes.object.isRequired,
  alerts: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      end: PropTypes.number,
      start: PropTypes.number.isRequired
    }).isRequired
  ).isRequired
};
