/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Button } from '@instana/components';

import { Td } from 'in-components/tables/sharedComponents/Table';

import locals from './ActionColumn.mless';

export default function ActionCol({ cols, action, actionHref, label }) {
  return (
    <Td colSpan={cols}>
      <div className={locals.wrapper}>
        <Button
          kind="action"
          href={actionHref}
          onClick={
            action
              ? e => {
                  e.preventDefault();
                  e.stopPropagation();
                  action();
                }
              : undefined
          }
        >
          {label}
        </Button>
      </div>
    </Td>
  );
}
