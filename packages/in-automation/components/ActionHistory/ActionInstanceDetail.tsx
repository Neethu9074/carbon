/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useEffect, useMemo, useState } from 'react';

import { SecondLevelNavigation, SecondLevelNavigationItem } from '@instana/components';
import { useObservable } from '@instana/hooks';

import { ActionInstanceDialogTitle } from 'in-automation/components/ActionHistory/ActionInstanceDialogTitle';
import DashboardHeaderShadowModule from 'in-components/DashboardHeader/DashboardHeaderShadowModule';
import DetailsOutputTab from 'in-automation/components/ActionHistory/DetailsOutputTab';
import DetailParamsTab from 'in-automation/components/ActionHistory/DetailParamsTab';
import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter';
import { automationActionInstanceFeedbackEnabled } from 'in-services/featureFlags';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import getActionInstance from 'in-automation/subscriptions/getActionInstance';
import DetailTab from 'in-automation/components/ActionHistory/DetailTab';
import Feedback from 'in-automation/components/ActionHistory/Feedback';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
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
  const [currentTab, setCurrentTab] = useState('detailTab');

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

  const tabs = {
    detailTab: {
      label: t('in-automation:actionHistory.properties'),
      component: () => <DetailTab id={id} properties={data} />
    },
    ...(data?.output !== null &&
      data?.output?.trim().length !== 0 && {
        outputTab: {
          label: t('in-automation:actionHistory.output'),
          component: () => <DetailsOutputTab output={data?.output} />
        }
      }),
    paramsTab: {
      label: t('in-automation:actionHistory.inputParameters'),
      component: () => <DetailParamsTab inputParameters={data?.inputParameters} />
    },
    ...(automationActionInstanceFeedbackEnabled && {
      feedbackTab: {
        label: t('in-automation:actionHistory.feedbackTab'),
        component: () => (
          <Feedback id={id} feedback={feedback} comment={comment} setHasStaleFeedback={setHasStaleFeedback} />
        )
      }
    })
  };

  return (
    <div className={locals.detailDialog}>
      <Dialog
        title={<ActionInstanceDialogTitle title={title} status={data?.status} />}
        onClose={close}
        doNotCloseOnOutsideClick
        withoutBodyPadding
      >
        {errors.length > 0 ? (
          <ErroneousResultPresenter errors={[...errors]} />
        ) : (
          <div>
            <LeftRightPadding>
              <SecondLevelNavigation>
                {Object.keys(tabs).map(key => (
                  <SecondLevelNavigationItem
                    key={key}
                    isActive={currentTab === key}
                    // @ts-ignore
                    label={tabs[key].label}
                    onClick={() => {
                      if (currentTab === 'feedbackTab' && hasStaleFeedback) {
                        setHasStaleFeedback(false);
                        setReload(Math.random());
                      }
                      setCurrentTab(key);
                    }}
                  />
                ))}
              </SecondLevelNavigation>
            </LeftRightPadding>
            <DashboardHeaderShadowModule />
            {/* @ts-ignore */}
            {tabs[currentTab].component()}
          </div>
        )}
      </Dialog>
    </div>
  );
}
