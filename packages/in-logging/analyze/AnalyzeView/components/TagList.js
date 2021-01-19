/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import classNames from 'classnames';
import React from 'react';

import HorizontalFlexWrapper from 'in-new-components/layout/HorizontalFlexWrapper';
import HealthDot from 'in-new-components/health/HealthDot';
import Link from 'in-components/Link';

import locals from './TagList.mless';

export default function TagList({ tags, onSelectTagHref }) {
  return (
    <>
      {tags.map(({ tag, value }, i) => (
        <Tag key={i} tag={tag} value={value} onSelectTagHref={onSelectTagHref} />
      ))}
    </>
  );
}

function Tag({ tag, value, onSelectTagHref }) {
  const isLogLevel = tag.name === 'log.level';

  const tagComponent = (
    <HorizontalFlexWrapper
      className={classNames({
        [locals.tag]: true,
        [locals.clickable]: onSelectTagHref
      })}
    >
      {isLogLevel && <HealthInfo logLevel={value} />}
      <span className={locals.label}>{tag.label ?? tag.name}</span>
      <span className={locals.equals}>=</span>
      <span className={locals.value}>{value}</span>
    </HorizontalFlexWrapper>
  );

  if (onSelectTagHref) {
    return (
      <Link className={locals.link} href={onSelectTagHref({ name: tag.name, value })}>
        {tagComponent}
      </Link>
    );
  }

  return tagComponent;
}

function HealthInfo({ logLevel }) {
  const severity = getSeverityByLogLevel(logLevel);
  return severity && <HealthDot className={locals.dot} severity={severity} iconSize={10} />;
}

function getSeverityByLogLevel(level) {
  if ('ERROR' === level) {
    return 10;
  }
  if ('WARN' === level) {
    return 5;
  }
}
