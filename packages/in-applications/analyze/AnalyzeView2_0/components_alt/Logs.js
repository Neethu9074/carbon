/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { SvgIcon, KeyValue, ColumnizedContent, Ul, Li } from '@instana/components';

import {
  LOG_SERVICE_NAME,
  LOG_CUSTOM,
  LOG_LEVEL,
  getTraceIdTagFilter,
  getValueMatchTagFilter,
  LOG_MESSAGE
} from 'in-logging/queryBuilder';
import SidebarTagList from 'in-applications/analyze/components/TraceDetails/components/CallDetails/components/SidebarTagList';
import useLogsCursorPagination from 'in-logging/analyze/AnalyzeView/components/hooks/useLogsCursorPagination';
import LogHealthColumn from 'in-logging/analyze/AnalyzeView/components/LogHealthColumn';
import LoadingList from 'in-components/lists/List/sharedComponents/LoadingList';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import LogMessage from 'in-logging/analyze/AnalyzeView/components/LogMessage';
import ErrorList from 'in-components/lists/List/sharedComponents/ErrorList';
import { getServiceDashboard } from 'in-applications/navigation/paths';
import { jumpToLogs } from 'in-logging/analyze/AnalyzeView/tracker';
import { getLinkToAnalyze } from 'in-logging/navigation/paths';
import { formatDateTime } from 'in-services/formatters/date';
import IconLink from 'in-components/IconButton/IconLink';
import getLogs from 'in-logging/subscriptions/getLogs';
import Overlay from 'in-components/overlays/Overlay';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './Logs.mless';

const columnDefinitions = [
  {
    id: 'logLevel',
    label: 'Level',
    width: '4.5rem',
    widthInAbsoluteUnit: true,
    sortable: false,
    getContent({ tags }) {
      return <LogHealthColumn tags={tags} />;
    }
  },
  {
    id: 'timestamp',
    label: 'Timestamp',
    width: '11rem',
    widthInAbsoluteUnit: true,
    sortable: false,
    getContent({ timestamp }) {
      return <div>{formatDateTime(timestamp)}</div>;
    }
  },
  {
    id: 'log',
    label: 'Log',
    sortable: false,
    ellipsis: '1vw',
    getContent(log) {
      return <KeyValue accentuated inverted value={<LogMessage {...log} />} label={<ServiceLabel tags={log.tags} />} />;
    }
  },
  {
    id: 'link',
    sortable: false,
    width: '3rem',
    widthInAbsoluteUnit: true,
    getContent(log) {
      return (
        <Tooltip content={t('in-analyze:logDetails.similarLogs')}>
          <IconLink
            type="lib_analyze"
            href$={getLinkToAnalyze({
              tagFilterExpression: [getValueMatchTagFilter({ name: LOG_MESSAGE, value: log.message })]
            })}
            onClick={() => jumpToLogs({ source: 'similar logs' })}
          />
        </Tooltip>
      );
    }
  }
];

export default function Logs(props) {
  const { traceId, totalNumberOfLogs, timeConfigForLogs } = props;
  const { items, errors, progress } = useLogsCursorPagination(
    params => getData({ traceId, totalNumberOfLogs, timeConfigForLogs, ...params }),
    [traceId]
  );

  if (progress?.loading) {
    return <LoadingList numSkeletonRows={3} />;
  }

  const hasErrors = errors.length > 0;
  if (hasErrors) {
    return <ErrorList errors={errors} />;
  }

  return (
    <Ul space="disabled">
      {items.map(log => (
        <Li key={log.itemId} subList={<Details log={log} />}>
          <ColumnizedContent columnDefinitions={columnDefinitions} {...log} />
        </Li>
      ))}
    </Ul>
  );
}

function getData({ traceId, totalNumberOfLogs, timeConfigForLogs }) {
  return getLogs({
    timeConfig: timeConfigForLogs,
    retrievalSize: totalNumberOfLogs,
    tagFilterExpression: getTraceIdTagFilter(traceId),
    tags: [LOG_LEVEL, LOG_SERVICE_NAME, LOG_CUSTOM]
  });
}

function ServiceLabel({ tags }) {
  const serviceName = getServiceNameFromTags(tags);
  if (!serviceName) {
    return null;
  }

  return (
    <HorizontalFlexWrapper>
      <SvgIcon className={locals.serviceIcon} type="lib_application_service" size="s" />

      <Overlay
        align="bottomLeft"
        content={() => {
          const serviceId = getServiceIdFromTags(tags);

          return (
            <Ul>
              <Li
                href$={getLinkToAnalyze({
                  tagFilterExpression: [getValueMatchTagFilter({ name: LOG_SERVICE_NAME, value: serviceName })]
                })}
              >
                {t('in-analyze:logDetails.similarServiceLogs')}
              </Li>
              {serviceId && <Li href$={getServiceDashboard(serviceId)}>{t('in-analyze:logDetails.service')}</Li>}
            </Ul>
          );
        }}
        withoutWrapper
      >
        {({ toggle, refSetter }) => (
          <span className={locals.serviceName} onClick={toggle} ref={refSetter}>
            {serviceName}
          </span>
        )}
      </Overlay>
    </HorizontalFlexWrapper>
  );
}

function getServiceNameFromTags(tags) {
  return tags.filter(({ name }) => name === LOG_SERVICE_NAME)[0]?.stringValue;
}

function Details({ log }) {
  const tags = log.tags.map(mapToSiderbarTagListObject);
  return (
    <span>
      <div className={locals.logMessageWrapper}>
        <LogMessage {...log} />
      </div>
      <SidebarTagList tags={tags} leftAligned />
    </span>
  );
}

function mapToSiderbarTagListObject(tag) {
  return {
    name: getTagKey(tag),
    value: tag.stringValue ?? tag.doubleValue ?? tag.booleanValue ?? tag.longValue
  };
}

function getTagKey({ label, name, key }) {
  const tagName = label ?? name;
  return key ? `${tagName} - ${key}` : tagName;
}

function getServiceIdFromTags(tags) {
  return tags.filter(({ name, key }) => name === LOG_CUSTOM && key === 'service_id')[0]?.stringValue;
}
