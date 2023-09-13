/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useMemo } from 'react';
import classNames from 'classnames';

import { Li, Ul } from '@instana/components';

import { GetHrefToGroupedView, GetHrefWithAdditionalTagFilter } from 'in-components/AnalyzeView/StateManagement';
import { fillWithParams, MESSAGE_CHUNK, toChunks } from 'in-services/util/stringToChunks';
import { logMessageParameterClicked } from 'in-logging/analyze/AnalyzeView/tracker';
import { TAG } from 'in-components/QueryBuilder/transformation/formModel';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { compareIgnoreCase } from 'in-services/util/string';
import Overlay from 'in-components/overlays/Overlay';
import { LogTag, TagFilter } from 'in-types';
import { t } from 'in-i18n';

import locals from './LogMessage.mless';

interface LogMessageProps {
  tags: LogTag[];
  message: string;
  isExpanded: boolean;
  isHovered: boolean;
  setIsExpanded?: React.Dispatch<React.SetStateAction<boolean>>;
  setIsHovered?: React.Dispatch<React.SetStateAction<boolean>>;
  getHrefWithAdditionalTagFilter?: GetHrefWithAdditionalTagFilter;
  getHrefToGroupedView?: GetHrefToGroupedView;
}

export default function LogMessage({
  tags,
  message,
  getHrefWithAdditionalTagFilter,
  getHrefToGroupedView,
  setIsHovered
}: LogMessageProps) {
  return useMemo(() => {
    const paramTags = tags
      .filter(({ key }) => key && key.indexOf('_msg_param') === 0)
      .sort((paramA, paramB) => compareIgnoreCase(paramA.key || '', paramB.key || ''));

    return (
      <>
        {fillWithParams(toChunks(message, ['{}']), paramTags).map(({ type, value }, i) =>
          type === MESSAGE_CHUNK ? (
            <MessageTag key={i} message={value} setIsHovered={setIsHovered} />
          ) : (
            <ParamTag
              key={i}
              tag={value as LogTag}
              getHrefWithAdditionalTagFilter={getHrefWithAdditionalTagFilter}
              getHrefToGroupedView={getHrefToGroupedView}
            />
          )
        )}
      </>
    );
  }, [message, tags, getHrefWithAdditionalTagFilter, getHrefToGroupedView, setIsHovered]);
}

function getTagExpressionWithTag(name: string, key?: string, value?: string): TagFilter {
  return {
    key,
    value,
    name,
    type: TAG,
    operator: EQUALS,
    entity: 'NOT_APPLICABLE'
  };
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
  getHrefWithAdditionalTagFilter?: GetHrefWithAdditionalTagFilter;
  getHrefToGroupedView?: GetHrefToGroupedView;
}

function ParamTag({ tag, getHrefWithAdditionalTagFilter, getHrefToGroupedView }: ParamTagProps) {
  const value = String((tag.stringValue ?? tag.doubleValue ?? tag.booleanValue ?? tag.longValue) || '');

  if (getHrefWithAdditionalTagFilter && getHrefToGroupedView) {
    return (
      <Overlay
        align="bottomLeft"
        content={() => (
          <Ul className={locals.list}>
            <Li
              className={locals.listItem}
              href={getHrefWithAdditionalTagFilter(getTagExpressionWithTag(tag.name || '', tag.key, value))}
              onDefaultHrefInteractionSideEffect={() => logMessageParameterClicked({ key: tag.key })}
            >
              {t('in-logging:addAsFilter')}
            </Li>
            {tag.name && (
              <Li
                className={locals.listItem}
                href={getHrefToGroupedView({ tag: tag.name, secondLevelKey: tag.key })}
                onDefaultHrefInteractionSideEffect={() => logMessageParameterClicked({ key: tag.key })}
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
