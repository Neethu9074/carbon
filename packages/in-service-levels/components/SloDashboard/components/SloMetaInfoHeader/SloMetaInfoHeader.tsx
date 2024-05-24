/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Route, Switch } from 'react-router-dom';
import React from 'react';

import { ButtonGroup } from '@instana/components';
import { Stack } from '@instana/components';
import { t } from '@instana/i18n-react';

import SloDashboardMetaInfo from 'in-service-levels/components/SloDashboard/components/SloDashboardMetaInfo';
import AdditionalDashboardHeader from 'in-components/AdditionalDashboardHeader/AdditionalDashboardHeader';
import tabs, { ApplicationSloTabData } from 'in-service-levels/components/SloDashboard/tabs';
import useSloTimeWindowContext from 'in-service-levels/hooks/useSloTimeWindowContext';
import { SloTimeWindowTypes } from 'in-service-levels/constants';

import locals from './SloMetaInfoHeader.mless';

type SloMetaInfoHeaderProps = Partial<ApplicationSloTabData>;

export default function SloMetaInfoHeader({ configuration, entity, service, endpoint }: SloMetaInfoHeaderProps) {
  if (!configuration) return null;

  return (
    <AdditionalDashboardHeader className={locals.metaInfoHeader}>
      <Stack align="start" direction="horizontal" distribution="spaceBetween" wrap>
        <SloDashboardMetaInfo configuration={configuration} entity={entity} service={service} endpoint={endpoint} />
        <TabButtons />
      </Stack>
    </AdditionalDashboardHeader>
  );
}

function TabButtons() {
  const { selectedTimeWindowType, updateSelectedTimeWindowType } = useSloTimeWindowContext();
  const sloSummaryTab = tabs[0];

  return (
    <Switch>
      <Route key={sloSummaryTab.path} path={sloSummaryTab.path}>
        <ButtonGroup
          buttonPropsList={[
            {
              key: SloTimeWindowTypes.SELECTED_TIME,
              text: t('in-service-levels:sloDashboard.timeWindowSelection.timeWindow', {
                context: SloTimeWindowTypes.SELECTED_TIME
              }),
              onClick: () => updateSelectedTimeWindowType(SloTimeWindowTypes.SELECTED_TIME)
            },
            {
              key: SloTimeWindowTypes.SLO_TIME_WINDOW,
              text: t('in-service-levels:sloDashboard.timeWindowSelection.timeWindow', {
                context: SloTimeWindowTypes.SLO_TIME_WINDOW
              }),
              onClick: () => updateSelectedTimeWindowType(SloTimeWindowTypes.SLO_TIME_WINDOW)
            }
          ]}
          activeKey={selectedTimeWindowType}
        />
      </Route>
    </Switch>
  );
}
