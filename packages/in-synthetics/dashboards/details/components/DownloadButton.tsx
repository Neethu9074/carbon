/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { Button } from '@instana/components';
import { t } from '@instana/i18n-react';

import ViewScreenshotsDialog from 'in-synthetics/dashboards/details/components/ViewScreenshotsDialog';
import { IMGFormatType, RECORDINGFormatType } from 'in-synthetics/utils/getValidFormat';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { Col } from 'in-components/layout/Grid/Grid';
import download from 'in-synthetics/utils/download';

import locals from 'in-synthetics/dashboards/details/components/DownloadButton.mless';

interface DownloadButtonProps {
  testId: string;
  resultId: string;
  metadata: string;
  startTime: number;
}

export default function DownloadButton({ testId, resultId, metadata, startTime }: DownloadButtonProps) {
  const resultMetadata = metadata.split(',');
  const resultsApiPath = '/api/synthetics/results/';
  const harRef: string = `${resultsApiPath}${testId}/${resultId}/file?type=HAR`;
  const logRef: string = `${resultsApiPath}${testId}/${resultId}/file?type=LOGS`;
  const videoRef: string = `${resultsApiPath}${testId}/${resultId}/file?type=VIDEOS`;

  const isScreenshotAvailable: boolean = resultMetadata.includes(IMGFormatType);
  const isRecordingAvailable: boolean = resultMetadata.includes(RECORDINGFormatType);

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
          icon={'lib_views_external_link'}
          onClick={() =>
            addActiveDialog(<ViewScreenshotsDialog testId={testId} resultId={resultId} startTime={startTime} />)
          }
          hidden={isScreenshotAvailable ? false : true}
        >
          {t('in-synthetics:dashboard.detailsPage.viewScreenshotsLabel')}
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
