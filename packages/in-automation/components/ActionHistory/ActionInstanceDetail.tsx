/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useEffect, useMemo, useState } from 'react';

import { useObservable } from '@instana/hooks';

import DashboardHeaderShadowModule from 'in-components/DashboardHeader/DashboardHeaderShadowModule';
import TabPane from 'in-automation/components/ActionHistory/actionInstanceDetailTabs/TabPane';
import Tabs from 'in-automation/components/ActionHistory/actionInstanceDetailTabs/Tabs';
import DetailsOutputTab from 'in-automation/components/ActionHistory/DetailsOutputTab';
import DetailParamsTab from 'in-automation/components/ActionHistory/DetailParamsTab';
import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import getActionInstance from 'in-automation/subscriptions/getActionInstance';
import DetailTab from 'in-automation/components/ActionHistory/DetailTab';
import Feedback from 'in-automation/components/ActionHistory/Feedback';
import { close } from 'in-components/DialogPresenter/store';
import { pendingResult } from 'in-services/fixedObjects';
import useTimeConfig from 'in-hooks/useTimeConfig';
import Dialog from 'in-components/Dialog/Dialog';
import { t } from 'in-i18n';

import locals from './ActionInstanceDetail.mless';

export default function ActionInstanceDetail({ id, title }: { id?: string; title: string }) {
  const timeConfig = useTimeConfig();
  const [hasStaleFeedback, setHasStaleFeedback] = useState(false);
  const [reload, setReload] = useState(0);

  const actionInstanceDetail =
    useObservable(
      () =>
        getActionInstance({
          actionInstanceId: id ?? '',
          timeConfig
        }),
      [id, timeConfig, reload]
    ) ?? pendingResult;

  // cache the action instance data so when we reload the data, the LoadingIndicator won't reappear and discard the tab state
  const [cachedActionInstanceDetail, setCachedActionInstanceDetail] = useState(actionInstanceDetail);

  useEffect(() => {
    if (!actionInstanceDetail.progress?.loading) {
      setCachedActionInstanceDetail(actionInstanceDetail);
    }
  }, [actionInstanceDetail]);

  const feedback = useMemo(
    () =>
      parseInt(
        cachedActionInstanceDetail?.data?.metadata.find(
          (data: { name: string; value: string }) => data.name === 'feedback'
        )?.value ?? '0'
      ),
    [cachedActionInstanceDetail]
  );

  const comment = useMemo(
    () =>
      cachedActionInstanceDetail?.data?.metadata.find(
        (data: { name: string; value: string }) => data.name === 'comment'
      )?.value ?? '',
    [cachedActionInstanceDetail]
  );

  if (cachedActionInstanceDetail.progress?.loading) {
    return <LoadingIndicator size="l" />;
  }
  const { errors, data } = cachedActionInstanceDetail;

  const handleTabChange = (from: number, _: number) => {
    // fetch the data again only if we navigate away from the feedback tab
    if (from === 2 && hasStaleFeedback) {
      setHasStaleFeedback(false);
      setReload(Math.random());
    }
  };

  return (
    <div className={locals.detailDialog}>
      <Dialog title={title} onClose={close} withoutBodyPadding>
        {errors.length > 0 ? (
          <ErroneousResultPresenter errors={[...errors]} />
        ) : (
          <Tabs onTabChange={handleTabChange}>
            <TabPane title={t('in-automation:actionHistory.properties')}>
              <DashboardHeaderShadowModule />
              <DetailTab id={id} properties={data} />
            </TabPane>

            {data?.output !== null && data?.output?.trim().length !== 0 ? (
              <TabPane title={t('in-automation:actionHistory.output')}>
                <DashboardHeaderShadowModule />
                <DetailsOutputTab output={data?.output} />
              </TabPane>
            ) : null}

            <TabPane title={t('in-automation:actionHistory.inputParameters')}>
              <DashboardHeaderShadowModule />
              <DetailParamsTab inputParameters={data?.inputParameters} />
            </TabPane>
            <TabPane title={t('in-automation:actionHistory.feedbackTab')}>
              <DashboardHeaderShadowModule />
              <Feedback id={id} feedback={feedback} comment={comment} setHasStaleFeedback={setHasStaleFeedback} />
            </TabPane>
          </Tabs>
        )}
      </Dialog>
    </div>
  );
}
