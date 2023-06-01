/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { useObservable } from '@instana/hooks';

import DashboardHeaderShadowModule from 'in-components/DashboardHeader/DashboardHeaderShadowModule';
import TabPane from 'in-automation/components/ActionHistory/actionInstanceDetailTabs/TabPane';
import Tabs from 'in-automation/components/ActionHistory/actionInstanceDetailTabs/Tabs';
import DetailParamsTab from 'in-automation/components/ActionHistory/DetailParamsTab';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import getActionInstance from 'in-automation/subscriptions/getActionInstance';
import DetailTab from 'in-automation/components/ActionHistory/DetailTab';
import { close } from 'in-components/DialogPresenter/store';
import { pendingResult } from 'in-services/fixedObjects';
import useTimeConfig from 'in-hooks/useTimeConfig';
import Dialog from 'in-components/Dialog/Dialog';
import { t } from 'in-i18n';

import locals from './actionInstanceDetail.mless';

export default function ActionInstanceDetail({ id, title }: { id: string; title: string }) {
  const timeConfig = useTimeConfig();
  const actionInstanceDetail =
    useObservable(
      getActionInstance({
        actionInstanceId: id,
        timeConfig
      }),
      [id, timeConfig]
    ) ?? pendingResult;

  if (actionInstanceDetail.progress?.loading) {
    return <LoadingIndicator size="l" />;
  }
  return (
    <div className={locals.detailDialog}>
      <Dialog title={title} onClose={close} withoutBodyPadding>
        <>
          <Tabs>
            <TabPane title={t('in-automation:actionHistory.properties')}>
              <DashboardHeaderShadowModule />

              <DetailTab id={id} properties={actionInstanceDetail.data} />
            </TabPane>
            <TabPane title={t('in-automation:actionHistory.inputParameters')}>
              <DashboardHeaderShadowModule />
              <DetailParamsTab inputParameters={actionInstanceDetail?.data?.inputParameters} />
            </TabPane>
          </Tabs>
        </>
      </Dialog>
    </div>
  );
}
