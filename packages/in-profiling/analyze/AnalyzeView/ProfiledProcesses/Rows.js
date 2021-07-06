/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { TableHorizontalIndicatorRow, TableLoadingSkeletonRows, TableErrorRows } from '@instana/components';

import Row from 'in-profiling/analyze/AnalyzeView/ProfiledProcesses/Row';

export default function ProfiledProcessesTable(props) {
  const { items, errors, progress, cols } = props;

  return (
    <>
      {items.map((item, i) => (
        <Row key={i} {...props} item={item.profiledProcess} />
      ))}

      <TableHorizontalIndicatorRow cols={cols} progress={progress} />
      <TableErrorRows cols={cols} errors={errors} size="compact" />
      {items.length === 0 && progress.loading && <TableLoadingSkeletonRows cols={cols} />}
    </>
  );
}
