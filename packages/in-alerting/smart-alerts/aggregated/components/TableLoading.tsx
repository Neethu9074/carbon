/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { TableHorizontalIndicatorRow, Table, Tbody } from '@instana/legacy';
import { TableSkeleton } from '@instana/components';
import { Progress } from '@instana/types';

import locals from 'in-alerting/smart-alerts/aggregated/components/TableLoading.mless';

export default function TableLoading({ progress }: { progress: Progress }): JSX.Element {
  return (
    <Table className={locals.fullWidth}>
      <Tbody>
        <TableHorizontalIndicatorRow cols={3} progress={progress} />
        <TableSkeleton columnCount={3} rowCount={6} />
      </Tbody>
    </Table>
  );
}
