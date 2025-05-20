/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

/* eslint-disable no-restricted-imports */
import React, { useState, useEffect } from 'react';

import { CarbonMultiSelect, CarbonModal, Typography, CarbonCallout } from '@instana/components';
import { useObservable } from '@instana/hooks';

import { CustomDashboardWithUserSpecificInformation } from 'in-types';
import { isLoading, hasError } from 'in-services/util/result';
import { close } from 'in-components/DialogPresenter/store';
import { rbacTeamsEnabled } from 'in-services/featureFlags';
import { pendingResult } from 'in-services/fixedObjects';
import { getTeamsOverview } from 'in-api/teams';
import { t } from 'in-i18n';

import locals from './EditTeamsDialog.mless';

interface TeamTagEx {
  tag_id?: string;
  id?: string;
  entity_id: string;
  displayName: string;
}
interface customDashboardConfig extends CustomDashboardWithUserSpecificInformation {
  rbacTags: TeamTagEx[];
}
interface EditTeamsProps {
  config: customDashboardConfig;
  onSubmit: Function;
}

export default function EditTeamsDialog({ config, onSubmit }: EditTeamsProps) {
  const [selectedList, setSelectedList] = useState([]);
  const onSelectionChanged = (item: []) => {
    setSelectedList(item);
  };
  const handleSubmit = () => {
    const newConfig = { ...config, rbacTags: selectedList };
    onSubmit({
      ...newConfig
    });
    close();
  };
  const teamsResult = useObservable(getTeamsOverview, []) ?? pendingResult;
  const teamsLoading = isLoading(teamsResult);
  const teamsHasErrors = hasError(teamsResult);
  const teamsList = !teamsLoading && !teamsHasErrors ? teamsResult.data : [];
  const teamsAssigned = config?.rbacTags;
  useEffect(() => {
    if (rbacTeamsEnabled && !teamsLoading && !teamsHasErrors) {
      const teamsSelected = teamsAssigned
        ? teamsList.filter((item: any) => teamsAssigned.some((team: TeamTagEx) => (team.tag_id || team.id) == item.id))
        : [];
      setSelectedList(teamsSelected);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamsAssigned, teamsList]);
  return (
    <CarbonModal
      open
      onRequestClose={close}
      modalHeading={t('in-custom-dashboards:customDashboard.editTeamsDialog.title')}
      primaryButtonText={t('in-custom-dashboards:save')}
      primaryButtonDisabled={false}
      secondaryButtonText={t('in-custom-dashboards:cancel')}
      size="md"
      onRequestSubmit={() => handleSubmit()}
    >
      <Typography variant="body-01">{t('in-custom-dashboards:customDashboard.editTeamsDialog.description')}</Typography>
      <CarbonCallout
        className={locals.message}
        subtitle={t('in-custom-dashboards:customDashboard.editTeamsDialog.calloutMessage')}
        lowContrast
      />
      <div id="teamsSelect" className={locals.teamsSelector}>
        <CarbonMultiSelect
          id="custDashTeamsSelect"
          size="sm"
          label={t('in-custom-dashboards:customDashboard.editTeamsDialog.chooseTeams')}
          titleText={t('in-custom-dashboards:customDashboard.editTeamsDialog.selectorLabel')}
          onChange={(data: any) => onSelectionChanged(data.selectedItems)}
          items={teamsList}
          selectedItems={selectedList}
          itemToString={(item: any) => (item ? item.name : '')}
        />
      </div>
    </CarbonModal>
  );
}
