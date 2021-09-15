/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useMemo } from 'react';
import classNames from 'classnames';

import { Li, Ul } from '@instana/components';

import { toChunks, fillWithParams, MESSAGE_CHUNK } from 'in-services/util/stringToChunks';
import { logMessageParameterClicked } from 'in-logging/analyze/AnalyzeView/tracker';
import { TAG } from 'in-components/QueryBuilder/transformation/formModel';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { compareIgnoreCase } from 'in-services/util/string';
import Overlay from 'in-components/overlays/Overlay';
import { LogTag, TagFilter } from 'in-types';
import { t } from 'in-i18n';

// @ts-expect-error
import locals from './LogMessage.mless';

interface GetHrefToGroupedViewParams {
  tag?: string;
  secondLevelKey?: string;
}

interface LogMessageProps {
  tags: LogTag[];
  message: string;
  isExpanded: boolean;
  isHovered: boolean;
  isOverflowing: boolean;
  setIsExpanded?: (v: boolean) => void;
  setIsHovered?: (v: boolean) => void;
  getHrefWithAdditionalTagFilter?: (tag: TagFilter) => string;
  getHrefToGroupedView?: (params: GetHrefToGroupedViewParams) => string;
}

export default function LogMessage({
  tags,
  message,
  getHrefWithAdditionalTagFilter,
  getHrefToGroupedView,
  setIsExpanded,
  isExpanded,
  isOverflowing,
  setIsHovered,
  isHovered
}: LogMessageProps) {
  const providesMessageExpanding = !isExpanded && isOverflowing && isHovered;

  return useMemo(() => {
    const paramTags = tags
      .filter(({ key }) => key && key.indexOf('_msg_param') === 0)
      .sort((paramA, paramB) => compareIgnoreCase(paramA.key || '', paramB.key || ''));

    return (
      <>
        {fillWithParams(toChunks(message, ['{}']), paramTags).map(({ type, value }, i) =>
          type === MESSAGE_CHUNK ? (
            <MessageTag
              key={i}
              message={value}
              providesMessageExpanding={providesMessageExpanding}
              setIsHovered={setIsHovered}
              setIsExpanded={setIsExpanded}
            />
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
  }, [message, tags, getHrefWithAdditionalTagFilter, getHrefToGroupedView, providesMessageExpanding]);
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
  setIsExpanded?: (v: boolean) => void;
  setIsHovered?: (v: boolean) => void;
  providesMessageExpanding: boolean;
}

function MessageTag({ message, setIsHovered, setIsExpanded, providesMessageExpanding }: MessageTagProps) {
  return (
    <span
      className={classNames({
        [locals.message]: true,
        [locals.hovered]: providesMessageExpanding
      })}
      onMouseEnter={() => setIsHovered?.(true)}
      onMouseLeave={() => setIsHovered?.(false)}
      onClick={() => providesMessageExpanding && setIsExpanded && setIsExpanded(true)}
    >
      {message}
    </span>
  );
}

interface ParamTagProps {
  tag: LogTag;
  getHrefWithAdditionalTagFilter?: (tag: TagFilter) => string;
  getHrefToGroupedView?: (params: GetHrefToGroupedViewParams) => string;
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
              onDefaultHrefInteractionSideEffect={() =>
                logMessageParameterClicked({ name: tag.name, key: tag.key, value })
              }
            >
              {t('in-logging:addAsFilter')}
            </Li>
            <Li
              className={locals.listItem}
              href={getHrefToGroupedView({ tag: tag.name, secondLevelKey: tag.key })}
              onDefaultHrefInteractionSideEffect={() =>
                logMessageParameterClicked({ name: tag.name, key: tag.key, value })
              }
            >
              {t('in-logging:addAsGroup')}
            </Li>
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
            onClick={toggle}
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
