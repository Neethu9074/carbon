/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { MutableRefObject } from 'react';

import { Li, SvgIcon, Ul, Button } from '@instana/components';
import { LogItem, LogTag } from '@instana/types';

import {
  getValueMatchTagFilter,
  getValueMatchTagFilterWithKey,
  LOG_CUSTOM,
  LOG_CUSTOM_KEY_SERVICE_ID,
  LOG_MESSAGE
} from 'in-logging/queryBuilder';
import { useLinkToLogs, useGenerateLinkToLogs } from 'in-logging/navigation/paths';
import { ANALYZE_LOGGING_JUMP_TO_LOGS } from 'in-services/tracking/eventNames';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import Overlay from 'in-components/overlays/Overlay';
import { t } from 'in-i18n';

import locals from 'in-logging/components/TraceDetails/components/LogDetails/components/AnalyzeLogsButton.mless';

interface AnalyzeLogsButtonProps {
  log: LogItem;
}

export default function AnalyzeLogsButton({ log }: AnalyzeLogsButtonProps) {
  const serviceId = getServiceId(log.tags);
  const similarLogsHref = useLinkToLogs({
    tagFilterExpression: [getValueMatchTagFilter({ name: LOG_MESSAGE, value: log.message })]
  });
  const generateLinkToLogs = useGenerateLinkToLogs();
  const { trackCta } = useSegmentTracking();
  return (
    <Overlay
      align="bottomLeft"
      content={() => (
        <Ul>
          <Li
            href={similarLogsHref}
            onDefaultHrefInteractionSideEffect={() =>
              trackCta(ANALYZE_LOGGING_JUMP_TO_LOGS, { source: 'similar logs' })
            }
          >
            {t('in-analyze:logDetails.similarLogs')}
          </Li>
          {serviceId && (
            <Li
              href={generateLinkToLogs({
                tagFilterExpression: [
                  getValueMatchTagFilterWithKey({
                    name: LOG_CUSTOM,
                    key: LOG_CUSTOM_KEY_SERVICE_ID,
                    value: serviceId
                  })
                ]
              })}
              onDefaultHrefInteractionSideEffect={() =>
                trackCta(ANALYZE_LOGGING_JUMP_TO_LOGS, { source: 'similar services' })
              }
            >
              {t('in-analyze:logDetails.similarServiceLogs')}
            </Li>
          )}
        </Ul>
      )}
      withoutWrapper
    >
      {({ toggle, refSetter, isOpen }) => (
        <Button
          kind="primary"
          icon="lib_analyze"
          onClick={toggle}
          refSetter={refSetter as MutableRefObject<HTMLButtonElement>}
          size="compact"
        >
          {t('in-analyze:logDetails.analyzeLogsLabel')}
          <SvgIcon className={locals.expandIcon} type={isOpen ? 'lib_arrow_drop_up' : 'lib_arrow_drop_down'} />
        </Button>
      )}
    </Overlay>
  );
}
function getServiceId(tags: LogTag[]) {
  return tags
    .filter(({ name, key }) => name === LOG_CUSTOM && key === 'service_id')
    .map(({ stringValue }) => stringValue)[0];
}
