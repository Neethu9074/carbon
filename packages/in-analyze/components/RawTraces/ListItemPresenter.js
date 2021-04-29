/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Link } from '@instana/components';
import classNames from 'classnames';
import React from 'react';

import { formatDateTime } from 'in-services/formatters/date';
import { latencyFixed } from 'in-services/formatters/number';

import locals from './ListItemPresenter.mless';

export default function ListItemPresenter({ label, time, duration, href$, onClick, active }) {
  return (
    <Link
      className={classNames({
        [locals.item]: true,
        [locals.active]: active
      })}
      href$={href$}
      onClick={onClick}
    >
      <span className={locals.label}>{label}</span>
      <div className={locals.secondRow}>
        <time dateTime={new Date(time).toISOString()}>{formatDateTime(time)}</time>
        {duration != null && <span className={locals.duration}>{latencyFixed.compact(duration)}</span>}
      </div>
    </Link>
  );
}
