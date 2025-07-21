/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { BusinessProcessItem, TimeConfig } from '@instana/types';

import { ServerTablePresenterProps } from 'in-components/tables/ServerTable/ServerTablePresenter';
import { businessConversionSummaryTabFullyQualified } from 'in-websites/navigation/paths';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { t } from 'in-i18n';

interface ConversionListProps extends ServerTablePresenterProps<BusinessProcessItem> {
  timeConfig: TimeConfig;
}

const ConversionGoalNameContent = () => {
  const { location, createHref } = useNavigation();
  location.pathname = businessConversionSummaryTabFullyQualified;
  return <a href={createHref(location)}>Average order value</a>;
};

const conversionGoalsColumnDefinitions: ColumnDefinition<BusinessProcessItem, ConversionListProps>[] = [
  {
    id: 'goal_name',
    sortable: true,
    defaultOrderDirection: 'DESC',
    label: t('in-websites:websiteDashboard.tabs.businessMonitoring.nameColumn'),
    width: '8rem',
    getContent: () => <ConversionGoalNameContent />
  },
  {
    id: 'goal_description',
    sortable: true,
    defaultOrderDirection: 'DESC',
    label: t('in-websites:websiteDashboard.tabs.businessMonitoring.descriptionColumn'),
    getContent: () => 'Description here'
  },
  {
    id: 'goal_sessions',
    sortable: true,
    defaultOrderDirection: 'DESC',
    label: t('in-websites:websiteDashboard.tabs.businessMonitoring.sessionsColumn'),
    getContent: () => 'Sessions here'
  },
  {
    id: 'goal_users',
    sortable: true,
    defaultOrderDirection: 'DESC',
    label: t('in-websites:websiteDashboard.tabs.businessMonitoring.usersColumn'),
    getContent: () => 'Users here'
  },
  {
    id: 'goal_averageTime',
    sortable: true,
    defaultOrderDirection: 'DESC',
    label: t('in-websites:websiteDashboard.tabs.businessMonitoring.averageTimeColumn'),
    getContent: () => 'Time here'
  }
];

export default conversionGoalsColumnDefinitions;
