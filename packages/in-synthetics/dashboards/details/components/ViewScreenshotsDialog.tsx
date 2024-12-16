/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { isEmpty } from 'lodash';
import React from 'react';

import { SecondLevelNavigation, SecondLevelNavigationItem } from '@instana/components';
import { generateUniqueShortId } from '@instana/utils';
import { useObservable } from '@instana/hooks';
import { Button } from '@instana/components';
import { Progress } from '@instana/types';
import { t } from '@instana/i18n-react';

import { ResultImages, ViewScreenshotsDialogProps, dummyTestResultImages } from 'in-synthetics/utils/constants';
import getTestResultDetailData from 'in-synthetics/subscriptions/getTestResultDetailData';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable/NoDataAvailable';
import { LoadingIndicator } from 'in-components/LoadingIndicators';
import { close } from 'in-components/DialogPresenter/store';
import download from 'in-synthetics/utils/download';
import Dialog from 'in-components/Dialog/Dialog';

import locals from './ViewScreenshotsDialog.mless';

export default function ViewScreenshotsDialog({ testId, resultId, startTime }: ViewScreenshotsDialogProps) {
  const resultsApiUrl = '/api/synthetics/results/';
  const imageRef: string = `${resultsApiUrl}${testId}/${resultId}/file?type=IMAGES`;

  const { data, progress } =
    useObservable<any, [number]>(() => {
      return getTestResultDetailData({
        testId: testId,
        testResultId: resultId,
        type: 'IMAGES',
        startTime: startTime
      });
    }, [0]) || dummyTestResultImages;

  // function to download individual screenshots
  const downloadBase64File = (base64Data: string, fileName: string) => {
    const downloadLink: HTMLAnchorElement = document.body.appendChild(document.createElement('a'));
    downloadLink.href = base64Data;
    downloadLink.download = fileName;
    downloadLink.click();
  };

  const renderImagesDialog = (progress: Progress, data: ResultImages) => {
    if (progress.loading) {
      return (
        <LoadingIndicator
          text={t('in-synthetics:dashboard.detailsPage.viewScreenshots.ScreenshotsLoadingMessage')}
          className={locals.loading}
        />
      );
    }

    if (
      data === undefined ||
      data === null ||
      isEmpty(data) ||
      !Object.keys((data as ResultImages)?.imageFiles).length ||
      Object.keys((data as ResultImages)?.imageFiles).length === 0
    ) {
      return (
        <NoDataAvailable
          type="lib_synthetic"
          height={160}
          text={t('in-synthetics:dashboard.detailsPage.viewScreenshots.noScreenshotsAvailableMessage')}
        />
      );
    } else {
      return (
        <>
          <div className={locals.buttonWrapper}>
            <Button
              className={locals.buttonLabel}
              kind="secondary"
              icon={'lib_actions_download'}
              onClick={() => download('IMAGES', imageRef)}
              hidden={Object.keys((data as ResultImages)?.imageFiles).length <= 1}
            >
              {t('in-synthetics:dashboard.detailsPage.viewScreenshots.allImagesButton')}
            </Button>
          </div>
          {Object.keys((data as ResultImages)?.imageFiles).map(filename => {
            return (
              <div className={locals.imagesWrapper} key={generateUniqueShortId()}>
                <Button
                  className={locals.imageButton}
                  kind="secondary"
                  icon={'lib_actions_download'}
                  onClick={() => downloadBase64File(`data:image/png;base64, ${data?.imageFiles[filename]}`, filename)}
                >
                  {t('in-synthetics:dashboard.detailsPage.viewScreenshots.imageButton')}
                </Button>
                <img className={locals.image} src={`data:image/png;base64, ${data?.imageFiles[filename]}`} />
              </div>
            );
          })}
        </>
      );
    }
  };

  return (
    <Dialog
      className={locals.dialog}
      title={t('in-synthetics:dashboard.detailsPage.viewScreenshots.screenshotsDialogLabel')}
      onClose={close}
    >
      <SecondLevelNavigation className={locals.tabs}>
        <SecondLevelNavigationItem
          label={t('in-synthetics:dashboard.detailsPage.viewScreenshots.allScreenshots')}
          isActive
        />
      </SecondLevelNavigation>
      <div className={locals.content}>{renderImagesDialog(progress, data)}</div>
    </Dialog>
  );
}
