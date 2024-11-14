/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Li, Link, Ul } from '@instana/components';
import { LogItem } from '@instana/types';

import {
  ApplicationProps,
  ApplicationsListProps,
  ToggleProps
} from 'in-logging/analyze/AnalyzeView/components/LogTagsTable/types';
import useResolvedValue from 'in-logging/analyze/AnalyzeView/components/hooks/useResolvedValue';
import useResolvedLink from 'in-logging/analyze/AnalyzeView/components/hooks/useResolvedLink';
import { ANALYZE_LOGGING_LOG_MESSAGE_TAG_CLICKED } from 'in-services/tracking/eventNames';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { LOG_CUSTOM_KEY_APPLICATION_ID } from 'in-logging/queryBuilder';
import Overlay from 'in-components/overlays/Overlay';
import Header from 'in-components/Dialog/Header';
import { t } from 'in-i18n';

import locals from 'in-logging/analyze/AnalyzeView/components/LogTagsTable.mless';

export default function ApplicationsListTag(props: {
  stringValue: string | undefined;
  item: LogItem;
  resolvedValue: string;
}) {
  return (
    <Overlay<ApplicationsListProps>
      content={ApplicationsList}
      props={{ applicationIds: (props.stringValue || '').split(','), item: props.item }}
      align="leftMiddle"
    >
      {({ toggle }: ToggleProps) => (
        <a className={locals.appListLink} onClick={toggle}>
          {props.resolvedValue}
        </a>
      )}
    </Overlay>
  );
}

export function ApplicationsList({ applicationIds, item }: ApplicationsListProps) {
  return (
    <div className={locals.applicationListOverlay}>
      <Header title={t('in-logging:applications')} />
      <Ul className={locals.applicationList}>
        {applicationIds.map(applicationId => (
          <Application key={applicationId} applicationId={applicationId} item={item} />
        ))}
      </Ul>
    </div>
  );
}

function Application({ applicationId, item }: ApplicationProps) {
  const resolvedLink =
    useResolvedLink(LOG_CUSTOM_KEY_APPLICATION_ID, { stringValue: applicationId }, item) || undefined;
  const resolvedValue = useResolvedValue(LOG_CUSTOM_KEY_APPLICATION_ID, { stringValue: applicationId });
  const {trackCta} = useSegmentTracking()
  return (
    <Li>
      <Link
        className={locals.value}
        href={resolvedLink}
        onClick={() => trackCta(ANALYZE_LOGGING_LOG_MESSAGE_TAG_CLICKED,{ tag: { name: LOG_CUSTOM_KEY_APPLICATION_ID, value: resolvedValue } })}
      >
        {resolvedValue}
      </Link>
    </Li>
  );
}
