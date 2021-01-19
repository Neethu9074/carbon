/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { withState } from 'recompose';
import React from 'react';

import ToggleStatusButtonGroup from 'in-kubernetes/Dashboards/commonComponents/ConditionsTableCard/ToggleStatusButtonGroup';
import ConditionsPresenter from 'in-kubernetes/Dashboards/commonComponents/ConditionsTableCard/ConditionsPresenter';
import ViewAllWrapper from 'in-new-components/TopListCard/ViewAllWrapper';
import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
import { compareIgnoreCase } from 'in-services/util/string';
import Card from 'in-new-components/Card';
import Link from 'in-components/Link';

import locals from './ConditionsTableCard.mless';

export default withState(
  'selectedStatus',
  'setSelectedStatus',
  null
)(function ConditionsTableCard({ setSelectedStatus, selectedStatus, viewAllHref$, conditions }) {
  if (!conditions || conditions.length === 0) {
    return <NoDataAvailable text="No Conditions found" />;
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
      <ConditionsPresenter conditions={presentedConditions} />

      <div className={locals.viewAllWrapper}>
        <ViewAllWrapper renderViewAll={ViewAll} viewAllHref$={viewAllHref$} className={locals.viewAllLink} />
      </div>
    </Card>
  );
});

function ViewAll({ viewAllHref$ }, className) {
  return (
    <Link className={className} href$={viewAllHref$}>
      View all conditions
    </Link>
  );
}
