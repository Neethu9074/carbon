/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import { Card } from '@instana/components';
import { Link } from '@instana/components';

import ToggleStatusButtonGroup from 'in-kubernetes/Dashboards/commonComponents/ConditionsTableCard/ToggleStatusButtonGroup';
import ConditionsPresenter from 'in-kubernetes/Dashboards/commonComponents/ConditionsTableCard/ConditionsPresenter';
import ViewAllWrapper from 'in-components/TopListCard/ViewAllWrapper';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable';
import { compareIgnoreCase } from 'in-services/util/string';
import { t } from 'in-i18n';

import locals from './ConditionsTableCard.mless';

export default function ConditionsTableCard({ viewAllHref, conditions }) {
  const [selectedStatus, setSelectedStatus] = useState(null);
  if (!conditions || conditions.length === 0) {
    return <NoDataAvailable text={t('in-kubernetes:dashboards.noConditionsFound')} />;
  }

  if (selectedStatus) {
    conditions = conditions.filter(condition => !compareIgnoreCase(condition.status, selectedStatus));
  }
  const maxPresentedConditions = 5;
  const presentedConditions = conditions.slice(0, maxPresentedConditions);
  return (
    <Card
      title={t('in-kubernetes:dashboards.conditions')}
      header={<ToggleStatusButtonGroup selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus} />}
    >
      <ConditionsPresenter conditions={presentedConditions} />

      <div className={locals.viewAllWrapper}>
        <ViewAllWrapper ViewAll={ViewAll} viewAllHref={viewAllHref} className={locals.viewAllLink} />
      </div>
    </Card>
  );
}

function ViewAll({ viewAllHref, className }) {
  return (
    <Link className={className} href={viewAllHref}>
      {t('in-kubernetes:dashboards.viewAllConditions')}
    </Link>
  );
}
