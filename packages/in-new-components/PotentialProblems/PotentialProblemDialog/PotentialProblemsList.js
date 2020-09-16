import React from 'react';

import { getType } from 'in-new-components/PotentialProblems/PotentialProblemDialog/potentialProblemsDialogUtil';
import { Ul, Li } from 'in-new-components/lists/List/List';
import SvgIcon from 'in-components/SvgIcon';

import locals from './PotentialProblemsList.mless';

export default function PotentialProblemsList({ alerts, alertConfig, ...remainingProps }) {
  if (alerts.length === 0) return null;

  return (
    <Ul className={locals.list}>
      {alerts.map((alert, i) => {
        const { alertType } = alertConfig[alert.key].rule;
        return <PotentialProblemsListItem key={i} alertType={alertType} alert={alert} {...remainingProps} />;
      })}
    </Ul>
  );
}

function PotentialProblemsListItem({ applicationLabel, serviceLabel, endpointLabel, alertType, alert, onItemClick }) {
  const type = getType({ applicationLabel, serviceLabel, endpointLabel });

  return (
    <Li className={locals.listItem} onClick={() => onItemClick(alert)}>
      <div className={locals.itemInnerWrapper}>
        <SvgIcon type="lib_application_trace" className={locals.icon} />
        <div>
          <div className={locals.itemName}>
            {endpointLabel ?? serviceLabel ?? applicationLabel} (<span className={locals.type}>{type}</span>)
          </div>
          <div className={locals.itemDescription}>{`Latency (${alertType}) significantly higher than expected`}</div>
        </div>
      </div>
    </Li>
  );
}
