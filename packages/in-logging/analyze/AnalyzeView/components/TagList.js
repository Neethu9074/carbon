/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import HorizontalFlexWrapper from 'in-new-components/layout/HorizontalFlexWrapper';
import Tooltip from 'in-components/Tooltip';
import Link from 'in-components/Link';

import locals from './TagList.mless';

export default function TagList({ tags, onSelectTagHref }) {
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
      <Link className={locals.link} href={onSelectTagHref({ name: tag.name, value, key: tag.key })}>
        {tagComponent}
      </Link>
    );
  }

  return tagComponent;
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
