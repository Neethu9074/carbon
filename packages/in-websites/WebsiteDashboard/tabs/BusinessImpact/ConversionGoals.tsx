/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useState } from 'react';

import { Button } from '@instana/components';
import { TimeConfig } from '@instana/types';

// @ts-expect-error Module needs to be translated to TS
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
// @ts-expect-error Module needs to be translated to TS
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import ConversionGoalsColumnDefinitions from 'in-websites/WebsiteDashboard/tabs/BusinessImpact/components/ConversionGoalsColumnDefinitions';
import CreateConversionGoalTearsheet from 'in-websites/WebsiteDashboard/tabs/BusinessImpact/components/CreateConversionGoalTearsheet';
import { getBusinessProcessListData } from 'in-bizops/lists/businessProcess/BusinessProcessList';
import { businessConversionGoalsFullyQualified } from 'in-websites/navigation/paths';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { t } from 'in-i18n';

interface ConversionGoalsProps {
  websiteId: string;
  timeConfig: TimeConfig;
  tagFilters: any;
}

const pathSegment = businessConversionGoalsFullyQualified;
const matrixPrefix = '';

const ServerTableWithUrlState = createServerTableWithUrlState({
  Renderer: withEmptyTableState({
    columnDefinitions: ConversionGoalsColumnDefinitions
  }),
  paginationResettingUrlParameters: [...timeConfigUrlParameters],
  columnDefinitions: ConversionGoalsColumnDefinitions,
  defaultOrderBy: 'goal_name',
  defaultOrderDirection: 'ASC',
  pathSegment,
  matrixPrefix
});

export default function ConversionGoals({ timeConfig }: ConversionGoalsProps) {
  const location = useLocation();
  const [goalTearsheetOpen, setGoalTearsheetOpen] = useState(false);

  const NewConversionGoalButton = () => {
    return (
      <Button
        kind="primary"
        onClick={() => {
          setGoalTearsheetOpen(true);
        }}
      >
        {t('in-websites:websiteDashboard.tabs.businessMonitoring.createConversionGoal')}
      </Button>
    );
  };

  return (
    <>
      <ServerTableWithUrlState
        get={getBusinessProcessListData}
        timeConfig={timeConfig}
        rightHeader={NewConversionGoalButton}
        location={location}
      />

      <CreateConversionGoalTearsheet open={goalTearsheetOpen} setOpen={setGoalTearsheetOpen} />
    </>
  );
}
