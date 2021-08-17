/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { useObservable } from '@instana/hooks';
import { SvgIcon } from '@instana/components';
import { Card } from '@instana/components';

import AnalyzeLogsButton from 'in-applications/analyze/components/TraceDetails/components/LogDetails/components/AnalyzeLogsButton';
import SidebarTagList from 'in-applications/analyze/components/TraceDetails/components/CallDetails/components/SidebarTagList';
import LoadingCallDetails from 'in-applications/analyze/components/TraceDetails/components/CallDetails/LoadingCallDetails';
import StackTrace from 'in-applications/analyze/components/TraceDetails/components/LogDetails/StackTrace';
import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter';
import LogMessage from 'in-logging/analyze/AnalyzeView/components/LogMessage';
import { hasError, isLoading } from 'in-services/util/result';
import { getSpanIdTagFilter } from 'in-logging/queryBuilder';
import ExpandableGroup from 'in-components/ExpandableGroup';
import { pendingResult } from 'in-services/fixedObjects';
import getLog from 'in-logging/subscriptions/getLog';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './LogDetails.mless';

export default function LogDetails(props) {
  const { selectedLogIdPair, onClose } = props;

  const logResult =
    useObservable(
      () =>
        getLog({ itemId: selectedLogIdPair.logId, tagFilterExpression: getSpanIdTagFilter(selectedLogIdPair.spanId) }),
      [selectedLogIdPair.logId, selectedLogIdPair.spanId]
    ) ?? pendingResult;

  if (isLoading(logResult)) {
    return (
      <div className={locals.logDetails}>
        <LoadingCallDetails onClose={onClose} progress={0} />
      </div>
    );
  }
  if (hasError(logResult)) {
    return (
      <div className={locals.logDetails}>
        <ErroneousResultPresenter errors={logResult.errors} />
      </div>
    );
  }

  const log = logResult.data;

  const tags = log.tags.filter(tag => !isParameterTag(tag)).map(mapToSiderbarTagListObject);

  // translate tag param key to not leak the technical rake
  const parameterTags = log.tags.filter(isParameterTag).map(mapToSiderbarTagListObject);

  return (
    <aside className={locals.logDetails}>
      <Card title={t('in-analyze:logDetails.title')} header={<CloseButton onClick={onClose} />}>
        <ExpandableGroup title="Message" defaultExpanded>
          <LogMessage {...log} />
        </ExpandableGroup>

        <ExpandableGroup title={t('in-analyze:logDetails.titleTags')}>
          <SidebarTagList tags={tags} />
        </ExpandableGroup>

        {parameterTags.length > 0 && (
          <ExpandableGroup title={t('in-analyze:logDetails.titleParameters')}>
            <SidebarTagList tags={parameterTags} />
          </ExpandableGroup>
        )}

        <StackTrace log={log} />

        <AnalyzeLogsButton log={log} />
      </Card>
    </aside>
  );
}

function CloseButton({ onClick }) {
  const closeLabel = t('in-analyze:logDetails.tooltipCloseLogDetails');
  return (
    <Tooltip content={closeLabel}>
      <SvgIcon onClick={onClick} aria-label={closeLabel} type="lib_openclose_cancel" />
    </Tooltip>
  );
}

function isParameterTag({ key }) {
  return key && key.indexOf('_msg_param') === 0;
}

function mapToSiderbarTagListObject(tag) {
  return {
    name: getTagKey(tag),
    value: tag.stringValue ?? tag.doubleValue ?? tag.booleanValue ?? tag.longValue
  };
}

function getTagKey({ label, name, key }) {
  const tagName = label ?? name;
  if (key) {
    return `${tagName} - ${isParameterTag(key) ? 'parameter' : key}`;
  }
  return tagName;
}
