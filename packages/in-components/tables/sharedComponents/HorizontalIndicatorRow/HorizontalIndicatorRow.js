/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import HorizontalIndicator from 'in-new-components/Loading/HorizontalIndicator';

import locals from './HorizontalIndicatorRow.mless';

export default function HorizontalIndicatorRow({ cols, progress }) {
  // Hidden tr is used to reset zebra striping, which is based on nth-child
  return (
    <Fragment>
      <tr className={locals.hiddenTr} />
      <tr className={locals.tr}>
        <td colSpan={cols} className={locals.td}>
          <HorizontalIndicator progress={progress} className={locals.indicator} />
        </td>
      </tr>
    </Fragment>
  );
}
