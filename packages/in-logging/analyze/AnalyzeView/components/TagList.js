/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';
import classNames from 'classnames';

import { useObservable } from '@instana/hooks';
import { SvgIcon } from '@instana/components';
import { Button } from '@instana/components';
import { Link } from '@instana/components';

import emptyTagFilterExpression from 'in-components/QueryBuilder/tagFilter/emptyTagFilterExpression';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import { logMessageTagClicked } from 'in-logging/analyze/AnalyzeView/tracker';
import { hasError, isLoading } from 'in-services/util/result';
import { pendingResult } from 'in-services/fixedObjects';
import getLog from 'in-logging/subscriptions/getLog';
import Tooltip from 'in-components/Tooltip';

import locals from './TagList.mless';

export default function TagList({ itemId, tags, onSelectTagHref, showLoadMoreAction }) {
  const [showAllTags, setShowAllTags] = useState(false);

  if (showAllTags) {
    return <AllTags itemId={itemId} tags={tags} onSelectTagHref={onSelectTagHref} />;
  }

  return (
    <>
      <List tags={tags} onSelectTagHref={onSelectTagHref} />
      {showLoadMoreAction && (
        <Button className={locals.button} size="compact" kind="action" onClick={() => setShowAllTags(true)}>
          show all
        </Button>
      )}
    </>
  );
}

function List({ tags, onSelectTagHref }) {
  return (
    <>
      {tags.map((tag, i) => (
        <Tag key={i} tag={tag} onSelectTagHref={onSelectTagHref} />
      ))}
    </>
  );
}

function Tag({ tag, onSelectTagHref }) {
  const value = tag.stringValue ?? tag.doubleValue ?? tag.booleanValue ?? tag.longValue;

  const tagComponent = (
    <Tooltip content={value}>
      <HorizontalFlexWrapper
        className={classNames({
          [locals.tag]: true,
          [locals.clickable]: onSelectTagHref
        })}
      >
        <span className={locals.label}>{getTagKey(tag)}</span>
        <span className={locals.equals}>=</span>
        <span className={locals.value}>{value}</span>
      </HorizontalFlexWrapper>
    </Tooltip>
  );

  if (onSelectTagHref) {
    return (
      <Link
        className={locals.link}
        href={onSelectTagHref({ name: tag.name, value, key: tag.key })}
        onClick={() => logMessageTagClicked({ name: tag.name, value, key: tag.key })}
      >
        {tagComponent}
      </Link>
    );
  }

  return tagComponent;
}

function AllTags({ itemId, tags, onSelectTagHref }) {
  const logResult =
    useObservable(() => getLog({ itemId: itemId, tagFilterExpression: emptyTagFilterExpression }), [itemId]) ??
    pendingResult;

  if (isLoading(logResult)) {
    return (
      <>
        <List tags={tags} onSelectTagHref={onSelectTagHref} />
        <Button className={locals.button} size="compact" kind="action" icon="lib_actions_loading" iconSpinning>
          loading
        </Button>
      </>
    );
  }

  if (hasError(logResult)) {
    return (
      <>
        <List tags={tags} onSelectTagHref={onSelectTagHref} />
        <Tooltip content={logResult.errors[0].message}>
          <div className={locals.tag}>
            <SvgIcon size="xs" type="lib_help_error_warning" />
          </div>
        </Tooltip>
      </>
    );
  }

  return <List tags={logResult.data.tags} onSelectTagHref={onSelectTagHref} />;
}

function getTagKey({ label, name, key }) {
  const tagName = label ?? name;
  if (key) {
    return `${tagName} - ${isParameterTag(key) ? 'parameter' : key}`;
  }
  return tagName;
}

function isParameterTag(key) {
  return key && key.indexOf('_msg_param') === 0;
}
