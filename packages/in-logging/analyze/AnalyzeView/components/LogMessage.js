/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useMemo } from 'react';
import classNames from 'classnames';

import { Li, Ul } from '@instana/components';

import { toChunks, fillWithParams, MESSAGE_CHUNK } from 'in-services/util/stringToChunks';
import { logMessageParameterClicked } from 'in-logging/analyze/AnalyzeView/tracker';
import { TAG } from 'in-new-components/QueryBuilder/transformation/formModel';
import { EQUALS } from 'in-new-components/QueryBuilder/tagFilter/operators';
import { compareIgnoreCase } from 'in-services/util/string';
import Overlay from 'in-new-components/overlays/Overlay';
import { t } from 'in-i18n';

import locals from './LogMessage.mless';

export default function LogMessage({ tags, message, getHrefWithAdditionalTagFilter, getHrefToGroupedView }) {
  const filledMessage = useMemo(() => {
    const paramTags = tags
      .filter(({ key }) => key && key.indexOf('_msg_param') === 0)
      .sort((paramA, paramB) => compareIgnoreCase(paramA.key, paramB.key));

    return (
      <>
        {fillWithParams(toChunks(message, ['{}']), paramTags).map(({ type, value }, i) =>
          type === MESSAGE_CHUNK ? (
            <MessageTag key={i} message={value} />
          ) : (
            <ParamTag
              key={i}
              tag={value}
              getHrefWithAdditionalTagFilter={getHrefWithAdditionalTagFilter}
              getHrefToGroupedView={getHrefToGroupedView}
            />
          )
        )}
      </>
    );
  }, [message, tags, getHrefWithAdditionalTagFilter, getHrefToGroupedView]);

  return filledMessage;
}

function getTagExpressionWithTag(tag) {
  return {
    ...tag,
    type: TAG,
    operator: EQUALS
  };
}

function MessageTag({ message }) {
  return <span className={locals.message}>{message}</span>;
}

function ParamTag({ tag, getHrefWithAdditionalTagFilter, getHrefToGroupedView }) {
  const value = tag.stringValue ?? tag.doubleValue ?? tag.booleanValue ?? tag.longValue;

  if (getHrefWithAdditionalTagFilter) {
    return (
      <Overlay
        align="bottomLeft"
        content={() => (
          <Ul className={locals.list}>
            <Li
              className={locals.listItem}
              href={getHrefWithAdditionalTagFilter(
                getTagExpressionWithTag({
                  name: tag.name,
                  value,
                  key: tag.key
                })
              )}
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
              [locals.parameter]: true,
              [locals.parameterOpen]: isOpen
            })}
            onClick={toggle}
            ref={refSetter}
          >
            {value}
          </span>
        )}
      </Overlay>
    );
  }
  return <span className={locals.parameter}>{value}</span>;
}
