import { withState } from 'recompose';
import React from 'react';

import ToggleStatusButtonGroup from 'in-kubernetes/Dashboards/commonComponents/ConditionsTableCard/ToggleStatusButtonGroup';
import { compareIgnoreCase } from 'in-services/util/string';
import Card from 'in-new-components/Card';
import Link from 'in-components/Link';

import locals from './ConditionsTableCard.mless';

export default withState('selectedStatus', 'setSelectedStatus', null)(function ConditionsTableCard({
  setSelectedStatus,
  selectedStatus,
  viewAllHref$,
  conditions,
  TablePresenter
}) {
  if (!conditions || conditions.length === 0) {
    return null;
  }

  if (selectedStatus) {
    conditions = conditions.filter(condition => !compareIgnoreCase(condition.status, selectedStatus));
  }
  const maxPresentedConditions = 5;
  const presentedConditions = conditions.slice(0, maxPresentedConditions);

  return (
    <Card
      title="Conditions"
      header={<ToggleStatusButtonGroup selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus} />}
    >
      <TablePresenter conditions={presentedConditions} />

      <div className={locals.viewAllWrapper}>
        <Link className={locals.viewAllLink} href$={viewAllHref$}>
          View all Conditions
        </Link>
      </div>
    </Card>
  );
});
