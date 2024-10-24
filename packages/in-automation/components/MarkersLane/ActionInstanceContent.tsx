/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState, useEffect, useMemo } from 'react';

import { SecondLevelNavigation, SecondLevelNavigationItem } from '@instana/components';
import { ActionInstance } from '@instana/types';
import { useObservable } from '@instana/hooks';

import ActionlaneDialogControls from 'in-automation/components/MarkersLane/ActionlaneDialogControls';
import DashboardHeaderShadowModule from 'in-components/DashboardHeader/DashboardHeaderShadowModule';
import DetailsOutputTab from 'in-automation/components/ActionHistory/DetailsOutputTab';
import { ActionListCalloutProps } from 'in-automation/components/MarkersLane/shared';
import getActionInstance from 'in-automation/subscriptions/getActionInstance';
import DetailTab from 'in-automation/components/ActionHistory/DetailTab';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import { pendingResult } from 'in-services/fixedObjects';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

import locals from './ActionInstanceContent.mless';

interface Tab {
  label: string;
  component: () => React.ReactNode;
}

export default function ActionInstanceContent({
  actionInstance,
  eventData
}: {
  actionInstance: ActionInstance;
  eventData: ActionListCalloutProps;
}) {
  const [currentTab, setCurrentTab] = useState('detailTab');
  const timeConfig = useTimeConfig();
  const actionInstanceId = actionInstance.actionInstanceId;
  const actionInstanceDetail =
    useObservable(
      () =>
        getActionInstance({
          actionInstanceId: actionInstanceId ?? '',
          timeConfig
        }),
      [actionInstanceId, timeConfig]
    ) ?? pendingResult;

  const [cachedActionInstanceDetail, setCachedActionInstanceDetail] = useState(actionInstanceDetail);
  useEffect(() => {
    if (!actionInstanceDetail.progress?.loading) {
      setCachedActionInstanceDetail(actionInstanceDetail);
    }
  }, [actionInstanceDetail]);

  const tabs: { [key: string]: Tab } = useMemo(() => {
    const baseTabs: { [key: string]: Tab } = {
      detailTab: {
        label: t('in-automation:actionHistory.properties'),
        component: () => <DetailTab id={actionInstanceId ?? ''} properties={actionInstance} inActionLane />
      }
    };

    if (cachedActionInstanceDetail?.data?.output?.trim()) {
      baseTabs['outputTab'] = {
        label: t('in-automation:actionHistory.output'),
        component: () => <DetailsOutputTab output={cachedActionInstanceDetail?.data.output ?? ''} />
      };
    }

    return baseTabs;
  }, [cachedActionInstanceDetail, actionInstanceId, actionInstance]);

  return (
    <div className={locals.container}>
      <div className={locals.detailsTable}>
        <div>
          <LeftRightPadding>
            <SecondLevelNavigation>
              {Object.keys(tabs).map(key => (
                <SecondLevelNavigationItem
                  key={key}
                  isActive={currentTab === key}
                  label={tabs[key].label}
                  onClick={() => {
                    setCurrentTab(key);
                  }}
                />
              ))}
            </SecondLevelNavigation>
          </LeftRightPadding>
          <DashboardHeaderShadowModule />
          {tabs[currentTab].component()}
        </div>
        <div className={locals.controls}>
          <ActionlaneDialogControls actionId={actionInstance.actionId} eventData={eventData} />
        </div>
      </div>
    </div>
  );
}
