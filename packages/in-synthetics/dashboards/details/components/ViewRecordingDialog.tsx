/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { isEmpty } from 'lodash';
import React from 'react';

import { CarbonButton as Button, CarbonModal as Modal } from '@instana/components';
import { useObservable } from '@instana/hooks';
import { Progress } from '@instana/types';

import { ResultRecording, dummyTestResultRecording } from 'in-synthetics/utils/constants';
import getTestResultDetailData from 'in-synthetics/subscriptions/getTestResultDetailData';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable/NoDataAvailable';
import { IconForButton } from 'in-plg/components/IconForButton/IconForButton';
import { LoadingIndicator } from 'in-components/LoadingIndicators';
import { close } from 'in-components/DialogPresenter/store';
import download from 'in-synthetics/utils/download';
import { t } from 'in-i18n';

import locals from './ViewRecordingDialog.mless';

interface ViewRecordingDialogProps {
  testId: string;
  resultId: string;
  startTime: number;
}

export default function ViewRecordingDialog({ testId, resultId, startTime }: ViewRecordingDialogProps) {
  const resultsApiUrl = '/api/synthetics/results/';
  const videoRef: string = `${resultsApiUrl}${testId}/${resultId}/file?type=VIDEOS`;

  const { progress, data } =
    useObservable<any, [number]>(() => {
      return getTestResultDetailData({
        testId: testId,
        testResultId: resultId,
        type: 'VIDEOS',
        startTime: startTime
      });
    }, [0]) || dummyTestResultRecording;

  const renderRecordingDialog = (progress: Progress, data: ResultRecording) => {
    if (progress.loading) {
      return (
        <LoadingIndicator
          text={t('in-synthetics:dashboard.detailsPage.viewRecording.recordingLoadingMessage')}
          className={locals.loading}
        />
      );
    }

    if (data === undefined || data === null || isEmpty(data)) {
      return (
        <NoDataAvailable
          type="lib_synthetic"
          height={160}
          text={t('in-synthetics:dashboard.detailsPage.viewRecording.noRecordingAvailableMessage')}
        />
      );
    } else {
      return (
        <>
          <div className={locals.buttonWrapper}>
            <Button
              onClick={() => download('VIDEOS', videoRef)}
              kind="ghost"
              size="sm"
              renderIcon={() => <IconForButton icon="lib_actions_download" iconSize="s" />}
            >
              <div>{t('in-synthetics:dashboard.detailsPage.viewRecording.downloadRecordingButton')}</div>
            </Button>
          </div>
          <div className={locals.videoWrapper}>
            <video controls>
              <source src={`data:image/png;base64, ${data?.videos}`} type="video/mp4" />
            </video>
          </div>
        </>
      );
    }
  };

  return (
    <Modal
      passiveModal
      modalHeading={t('in-synthetics:dashboard.detailsPage.viewRecording.recordingDialogLabel')}
      onRequestClose={close}
      preventCloseOnClickOutside
      open
    >
      <div className={locals.content}>{renderRecordingDialog(progress, data)}</div>
    </Modal>
  );
}
