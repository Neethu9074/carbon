/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Link, Stack, SvgIcon } from '@instana/components';
import { ToastNotification } from '@instana/carbon';

import { t } from 'in-i18n';

import locals from './CollectorDashboard.mless';

export default function RestartConnectionErrorMessage() {
  return (
    <div>
      <p>{t('in-infrastructure:collectorView.errors.failedRestartConnectionError')}</p>
      <Stack direction="vertical">
        <Link
          href="https://www.ibm.com/docs/en/instana-observability/latest?topic=collectors-instana-distribution-opentelemetry-collector#managing-the-instana-collector-service"
          external
        >
          {t('in-infrastructure:collectorView.errors.manualRestartLink')}
          <SvgIcon type="lib_views_external_link" size="xs" />
        </Link>
        <p>{new Date().toLocaleTimeString()}</p>
      </Stack>
    </div>
  );
}

export function FetchConfigConnectionErrorMsg() {
  return (
    <div>
      <p>{t('in-infrastructure:collectorView.errors.failedConfigFetchConnectionError')}</p>
      <Stack direction="vertical">
        <Link
          href="https://www.ibm.com/docs/en/instana-observability/latest?topic=collectors-instana-distribution-opentelemetry-collector#managing-the-instana-collector-service"
          external
        >
          {t('in-infrastructure:collectorView.errors.manualRestartLink')}
          <SvgIcon type="lib_views_external_link" size="xs" />
        </Link>
        <p>{new Date().toLocaleTimeString()}</p>
      </Stack>
    </div>
  );
}

export function UpdateConfigErrorMessage({
  error,
  setErrorMsg
}: {
  error: string;
  setErrorMsg: (error: string) => void;
}) {
  let parsedError = '';

  // Case 1: config validation failed
  if (error.includes('config validation failed')) {
    // Pattern 1: "Error: service::pipelines::traces: must have at least one receiver"
    const missingComponentRegex = /(?:.*?)Error: service::pipelines::(\w+): must have at least one (\w+)(?:.*)/s;
    const missingComponentMatch = error.match(missingComponentRegex);

    if (missingComponentMatch) {
      const pipelineType = missingComponentMatch[1]; // e.g., "traces"
      const componentType = missingComponentMatch[2]; // e.g., "receiver"
      parsedError = t('in-infrastructure:collectorView.errors.missingComponentMessage', {
        pipelineType,
        componentType
      });
    }
    // Pattern 2: "Error: service::pipelines::traces: references receiver "abcd" which is not configured"
    else {
      const missingReferenceRegex =
        /(?:.*?)Error: service::pipelines::(\w+): references (\w+) "(\w+)" which is not configured(?:.*)/s;
      const missingReferenceMatch = error.match(missingReferenceRegex);

      if (missingReferenceMatch) {
        const pipelineType = missingReferenceMatch[1]; // e.g., "traces"
        const componentType = missingReferenceMatch[2]; // e.g., "receiver"
        const componentName = missingReferenceMatch[3];
        parsedError = t('in-infrastructure:collectorView.errors.missingReferenceMessage', {
          pipelineType,
          componentType: componentType.charAt(0).toUpperCase() + componentType.slice(1),
          componentName
        });
      }
      // No specific pattern matched, use the original error
      else {
        parsedError = error;
      }
    }
  }
  // Case 2: cooldown period
  else if (error.includes('cooldown period')) {
    const cooldownRegex = /Config update ignored due to cooldown period \((\d+) seconds remaining\)/;
    const cooldownMatch = error.match(cooldownRegex);

    if (cooldownMatch && cooldownMatch[1]) {
      const secondsRemaining = cooldownMatch[1];
      parsedError = t('in-infrastructure:collectorView.errors.cooldownMessage', {
        secondsRemaining
      });
    } else {
      parsedError = error;
    }

    return (
      <ToastNotification
        className={locals.configErrorToast}
        title={t('in-infrastructure:collectorView.errors.updatesInProgress')}
        subtitle={parsedError}
        kind="warning"
        onCloseButtonClick={() => {
          //clear error message when closed
          setErrorMsg('');
        }}
      />
    );
  }
  // Case 3: no configuration changes
  else if (error.includes('No changes')) {
    return (
      <ToastNotification
        className={locals.configErrorToast}
        title={t('in-infrastructure:collectorView.errors.noChanges')}
        subtitle={t('in-infrastructure:collectorView.errors.configurationRemainsSame')}
        kind="warning"
        onCloseButtonClick={() => {
          setErrorMsg('');
        }}
      />
    );
  }
  // Default case: return the full data message
  else {
    parsedError = error;
  }

  return (
    <ToastNotification
      className={locals.configErrorToast}
      title={t('in-infrastructure:collectorView.errors.updateFailed')}
      subtitle={parsedError}
      onCloseButtonClick={() => {
        setErrorMsg('');
      }}
    />
  );
}
