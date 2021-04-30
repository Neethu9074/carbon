/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import useLogsCursorPagination from 'in-logging/analyze/AnalyzeView/components/hooks/useLogsCursorPagination';
import AnalyzeLogsButton from 'in-analyze/TraceDetail/components/LogDetails/components/AnalyzeLogsButton';
import SidebarTagList from 'in-analyze/TraceDetail/components/CallDetails/components/SidebarTagList';
import LoadingCallDetails from 'in-analyze/TraceDetail/components/CallDetails/LoadingCallDetails';
import LogMessage from 'in-logging/analyze/AnalyzeView/components/LogMessage';
import ExpandableGroup from 'in-new-components/ExpandableGroup';
import { getTraceIdTagFilter } from 'in-logging/queryBuilder';
import getLogs from 'in-logging/subscriptions/getLogs';
import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';
import Card from 'in-new-components/Card';
import { t } from 'in-i18n';

import locals from './LogDetails.mless';

export default function LogDetails(props) {
  const { onClose } = props;
  const log = useLog(props);

  if (!log) {
    return (
      <div className={locals.logDetails}>
        <LoadingCallDetails onClose={onClose} progress={0} />
      </div>
    );
  }

  const tags = [...log.tags.filter(tag => !isParameterTag(tag))].map(mapToSiderbarTagListObject);

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

function useLog(props) {
  const { logId, traceId, timeConfigForLogs, totalNumberOfLogs } = props;
  const { items = [] } = useLogsCursorPagination(
    params => getData({ traceId, timeConfigForLogs, totalNumberOfLogs, ...params }),
    [logId, traceId, totalNumberOfLogs]
  );

  return items.filter(({ itemId }) => itemId === logId)[0];
}

function getData({ traceId, timeConfigForLogs, totalNumberOfLogs }) {
  return getLogs({
    timeConfig: timeConfigForLogs,
    retrievalSize: totalNumberOfLogs,
    tagFilterExpression: getTraceIdTagFilter(traceId)
  });
}
