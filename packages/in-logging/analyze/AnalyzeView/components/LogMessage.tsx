/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useMemo } from 'react';
import classNames from 'classnames';

import { Code, Li, Ul } from '@instana/components';

import { GetHrefToGroupedView, GetHrefWithAdditionalTagFilter } from 'in-components/AnalyzeView/StateManagement';
import { useParamTagLinks } from 'in-logging/analyze/AnalyzeView/components/hooks/useParamTagLinks';
import { ANALYZE_LOGGING_LOG_MESSAGE_PARAMETER_CLICKED } from 'in-services/tracking/eventNames';
import { fillWithParams, MESSAGE_CHUNK, toChunks } from 'in-services/util/stringToChunks';
import { getPrettifiedJSON } from 'in-logging/analyze/AnalyzeView/components/utils';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { logFormattingEnabled } from 'in-services/featureFlags';
import { compareIgnoreCase } from 'in-services/util/string';
import Overlay from 'in-components/overlays/Overlay';
import { LogTag } from 'in-types';
import { t } from 'in-i18n';

import locals from './LogMessage.mless';

interface LogMessageProps {
  tags: LogTag[];
  message: string;
  setIsHovered?: React.Dispatch<React.SetStateAction<boolean>>;
  getHrefWithAdditionalTagFilter?: GetHrefWithAdditionalTagFilter;
  getHrefToGroupedView?: GetHrefToGroupedView;
}

export default function LogMessage({
  tags,
  message,
  getHrefWithAdditionalTagFilter,
  getHrefToGroupedView
}: LogMessageProps) {
  return useMemo(() => {
    const JSONString = getPrettifiedJSON(message);

    const paramTags = tags
      .filter(({ key }) => key && key.indexOf('_msg_param') === 0)
      .sort((paramA, paramB) => compareIgnoreCase(paramA.key || '', paramB.key || ''));

    if (JSONString && logFormattingEnabled) {
      return <Code withoutCopyButton softWrap lang="json" code={JSONString} wrapperClassName={locals.code} />;
    }

    return (
      <>
        {fillWithParams(toChunks(message, ['{}']), paramTags).map(({ type, value }, i) =>
          type === MESSAGE_CHUNK ? <MessageTag key={i} message={value} /> : <ParamTag key={i} tag={value as LogTag} />
        )}
      </>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message, tags, getHrefWithAdditionalTagFilter, getHrefToGroupedView]);
}

interface MessageTagProps {
  message: string;
  setIsHovered?: (v: boolean) => void;
}

function MessageTag({ message, setIsHovered }: MessageTagProps) {
  return (
    <span
      className={classNames({
        [locals.message]: true
      })}
      onMouseEnter={() => setIsHovered?.(true)}
      onMouseLeave={() => setIsHovered?.(false)}
    >
      {message}
    </span>
  );
}

interface ParamTagProps {
  tag: LogTag;
}

function ParamTag({ tag }: ParamTagProps) {
  const value = String((tag.stringValue ?? tag.doubleValue ?? tag.booleanValue ?? tag.longValue) || '');
  const { trackCta } = useSegmentTracking();
  const { getHrefWithAdditionalTagFilter, getHrefToGroupedView } = useParamTagLinks();

  if (getHrefWithAdditionalTagFilter && getHrefToGroupedView) {
    return (
      <Overlay
        align="bottomLeft"
        content={() => (
          <Ul className={locals.list}>
            <Li
              className={locals.listItem}
              href={getHrefWithAdditionalTagFilter(tag.name || '', tag.key || '', value)}
              onDefaultHrefInteractionSideEffect={() =>
                trackCta(ANALYZE_LOGGING_LOG_MESSAGE_PARAMETER_CLICKED, { key: tag.key })
              }
            >
              {t('in-logging:addAsFilter')}
            </Li>
            {tag.name && (
              <Li
                className={locals.listItem}
                href={getHrefToGroupedView(tag.name, tag.key || '')}
                onDefaultHrefInteractionSideEffect={() =>
                  trackCta(ANALYZE_LOGGING_LOG_MESSAGE_PARAMETER_CLICKED, { key: tag.key })
                }
              >
                {t('in-logging:addAsGroup')}
              </Li>
            )}
          </Ul>
        )}
        withoutWrapper
      >
        {({ toggle, refSetter, isOpen }) => (
          <span
            className={classNames({
              [locals.parameterClickable]: true,
              [locals.parameterOpen]: isOpen
            })}
            onClick={event => {
              event.stopPropagation();
              toggle();
            }}
            ref={refSetter as React.MutableRefObject<HTMLSpanElement>}
          >
            {value}
          </span>
        )}
      </Overlay>
    );
  }

  return <span className={locals.parameter}>{value}</span>;
}
