/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { CarbonMenuButton, CarbonMenuItem } from '@instana/components';
import { LogItem, LogTag } from '@instana/types';

import {
  getValueMatchTagFilter,
  getValueMatchTagFilterWithKey,
  LOG_CUSTOM,
  LOG_CUSTOM_KEY_SERVICE_ID,
  LOG_MESSAGE
} from 'in-logging/queryBuilder';
import { ANALYZE_LOGGING_JUMP_TO_LOGS } from 'in-services/tracking/eventNames';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { useLinkToLogs } from 'in-logging/navigation/paths';
import { t } from 'in-i18n';

import locals from './AnalyzeLogsButton.mless';

interface AnalyzeLogsButtonProps {
  log: LogItem;
}

export default function AnalyzeLogsButton({ log }: AnalyzeLogsButtonProps) {
  const serviceId = getServiceId(log.tags);
  const similarLogsHref = useLinkToLogs({
    tagFilterExpression: [getValueMatchTagFilter({ name: LOG_MESSAGE, value: log.message })]
  });
  const servicesRef = useLinkToLogs({
    tagFilterExpression: [
      getValueMatchTagFilterWithKey({
        name: LOG_CUSTOM,
        key: LOG_CUSTOM_KEY_SERVICE_ID,
        value: serviceId ?? ''
      })
    ]
  });
  const { trackCta } = useSegmentTracking();
  const { goToPath } = useNavigation();

  return (
    <CarbonMenuButton
      className={locals.button}
      //@ts-expect-error types are incorrect, "secondary" is a valid button type
      kind="secondary"
      label={t('in-analyze:logDetails.analyzeLogsLabel')}
      menuAlignment="bottom"
    >
      <CarbonMenuItem
        label={t('in-analyze:logDetails.similarLogs')}
        onClick={() => {
          trackCta(ANALYZE_LOGGING_JUMP_TO_LOGS, { source: 'similar logs' });
          goToPath(similarLogsHref.slice(2));
        }}
      />
      {serviceId && (
        <CarbonMenuItem
          label={t('in-analyze:logDetails.similarServiceLogs')}
          onClick={() => {
            trackCta(ANALYZE_LOGGING_JUMP_TO_LOGS, { source: 'similar services' });
            goToPath(servicesRef.slice(2));
          }}
        />
      )}
    </CarbonMenuButton>
  );
}

function getServiceId(tags: LogTag[]) {
  return tags
    .filter(({ name, key }) => name === LOG_CUSTOM && key === 'service_id')
    .map(({ stringValue }) => stringValue)[0];
}
