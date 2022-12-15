/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { Button } from '@instana/components';
import { t } from '@instana/i18n-react';

import { Col } from 'in-components/layout/Grid/Grid';
import download from 'in-synthetics/utils/download';

import locals from 'in-synthetics/dashboards/details/components/DownloadButton.mless';

interface DownloadButtonProps {
  testId: string;
  resultId: string;
}

export default function DownloadButton({ testId, resultId }: DownloadButtonProps) {
  const harRef: string = `/api/synthetics/results/${testId}/${resultId}/file?type=HAR`;
  const logRef: string = `/api/synthetics/results/${testId}/${resultId}/file?type=LOGS`;

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
      </div>
    </Col>
  );
}
