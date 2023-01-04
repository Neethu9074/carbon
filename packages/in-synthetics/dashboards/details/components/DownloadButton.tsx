/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { get } from 'lodash';
import React from 'react';

import { Button } from '@instana/components';
import { t } from '@instana/i18n-react';

import { ResultMetadataResponse } from 'in-synthetics/utils/constants';
import { Col } from 'in-components/layout/Grid/Grid';
import download from 'in-synthetics/utils/download';

import locals from 'in-synthetics/dashboards/details/components/DownloadButton.mless';

interface DownloadButtonProps {
  testId: string;
  resultId: string;
  testResultMetadata: ResultMetadataResponse;
}

export default function DownloadButton({ testId, resultId, testResultMetadata }: DownloadButtonProps) {
  const harRef: string = `/api/synthetics/results/${testId}/${resultId}/file?type=HAR`;
  const logRef: string = `/api/synthetics/results/${testId}/${resultId}/file?type=LOGS`;
  const imageRef: string = `/api/synthetics/results/${testId}/${resultId}/file?type=IMAGES`;
  const videoRef: string = `/api/synthetics/results/${testId}/${resultId}/file?type=VIDEOS`;

  const isScreenshotAvailable: boolean = get(testResultMetadata.data?.metadata, ['images.tar']) ? true : false;
  const isRecordingAvailable: boolean = get(testResultMetadata.data?.metadata, ['recordings.tar']) ? true : false;

  return (
    <Col xs>
      <div className={locals.button}>
        <Button
          className={locals.buttonLabel}
          kind="secondary"
          icon={'lib_actions_download'}
          onClick={() => download('HAR', harRef)}
        >
          {t('in-synthetics:dashboard.detailsPage.downloadHar')}
        </Button>
        <Button
          className={locals.buttonLabel}
          kind="secondary"
          icon={'lib_actions_download'}
          onClick={() => download('LOGS', logRef)}
        >
          {t('in-synthetics:dashboard.detailsPage.downloadLog')}
        </Button>
        <Button
          className={locals.buttonLabel}
          kind="secondary"
          icon={'lib_actions_download'}
          onClick={() => download('IMAGES', imageRef)}
          hidden={isScreenshotAvailable ? false : true}
        >
          {t('in-synthetics:dashboard.detailsPage.downloadImages')}
        </Button>
        <Button
          className={locals.buttonLabel}
          kind="secondary"
          icon={'lib_actions_download'}
          onClick={() => download('VIDEOS', videoRef)}
          hidden={isRecordingAvailable ? false : true}
        >
          {t('in-synthetics:dashboard.detailsPage.downloadVideo')}
        </Button>
      </div>
    </Col>
  );
}
