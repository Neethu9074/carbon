/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { Button } from '@instana/components';
import { t } from '@instana/i18n-react';

import ViewScreenshotsDialog from 'in-synthetics/dashboards/details/components/ViewScreenshotsDialog';
import ViewRecordingDialog from 'in-synthetics/dashboards/details/components/ViewRecordingDialog';
import { IMGFormatType, RECORDINGFormatType } from 'in-synthetics/utils/getValidFormat';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
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

  const isScreenshotAvailable: boolean = resultMetadata.includes(IMGFormatType);
  const isRecordingAvailable: boolean = resultMetadata.includes(RECORDINGFormatType);

  return (
    <>
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
        hidden={!isScreenshotAvailable}
      >
        {t('in-synthetics:dashboard.detailsPage.viewScreenshotsLabel')}
      </Button>
      <Button
        className={locals.buttonLabel}
        kind="secondary"
        icon={'lib_views_external_link'}
        onClick={() =>
          addActiveDialog(<ViewRecordingDialog testId={testId} resultId={resultId} startTime={startTime} />)
        }
        hidden={!isRecordingAvailable}
      >
        {t('in-synthetics:dashboard.detailsPage.viewRecordingLabel')}
      </Button>
    </>
  );
}
