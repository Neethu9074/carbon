/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useMemo } from 'react';

import { toChunks, MESSAGE_CHUNK } from 'in-logging/analyze/AnalyzeView/components/templateString';
import { TAG } from 'in-new-components/QueryBuilder/transformation/formModel';
import { EQUALS } from 'in-new-components/QueryBuilder/tagFilter/operators';
import { compareIgnoreCase } from 'in-services/util/string';
import Link from 'in-components/Link';

import locals from './LogMessage.mless';

export default function LogMessage({ logTags, message, getHrefWithAdditionalTagFilter }) {
  const filledMessage = useMemo(() => {
    const paramTags = logTags
      .filter(({ key }) => key && key.indexOf('_msg_param') === 0)
      .sort((paramA, paramB) => compareIgnoreCase(paramA.key, paramB.key));

    return (
      <>
        {toChunks(message, paramTags).map(({ type, value }, i) =>
          type === MESSAGE_CHUNK ? (
            <MessageTag key={i} message={value} />
          ) : (
            <ParamTag key={i} tag={value} getHrefWithAdditionalTagFilter={getHrefWithAdditionalTagFilter} />
          )
        )}
      </>
    );
  }, [message, logTags, getHrefWithAdditionalTagFilter]);

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

function ParamTag({ tag, getHrefWithAdditionalTagFilter }) {
  const value = tag.stringValue ?? tag.doubleValue ?? tag.booleanValue ?? tag.longValue;
  if (getHrefWithAdditionalTagFilter) {
    return (
      <Link
        className={locals.parameter}
        href={getHrefWithAdditionalTagFilter(
          getTagExpressionWithTag({
            name: tag.name,
            value,
            key: tag.key
          })
        )}
      >
        {value}
      </Link>
    );
  }
  return <span className={locals.parameter}>{value}</span>;
}
