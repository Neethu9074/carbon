/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Route, Switch } from 'react-router-dom';
import React from 'react';

import { ServiceLevelObjectiveConfiguration } from '@instana/types';
import { ButtonGroup } from '@instana/components';
import { Stack } from '@instana/components';

import SloDashboardMetaInfo from 'in-service-levels/components/SloDashboard/components/SloDashboardMetaInfo';
import AdditionalDashboardHeader from 'in-components/AdditionalDashboardHeader/AdditionalDashboardHeader';
import useSloTimeWindowContext from 'in-service-levels/hooks/useSloTimeWindowContext';
import tabs from 'in-service-levels/components/SloDashboard/tabs';
import { SloTimeWindowTypes } from 'in-service-levels/constants';
import { LabeledEntity } from 'in-service-levels/types';
import { t } from 'in-i18n';

import locals from './SloMetaInfoHeader.mless';

interface SloMetaInfoHeaderProps {
  configuration?: ServiceLevelObjectiveConfiguration;
  entities?: LabeledEntity[];
  service?: LabeledEntity;
  endpoint?: LabeledEntity;
}

export default function SloMetaInfoHeader({ configuration, entities, service, endpoint }: SloMetaInfoHeaderProps) {
  if (!configuration) return null;

  return (
    <AdditionalDashboardHeader className={locals.metaInfoHeader}>
      <Stack align="start" direction="horizontal" distribution="spaceBetween" wrap>
        <SloDashboardMetaInfo configuration={configuration} entities={entities} service={service} endpoint={endpoint} />
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
