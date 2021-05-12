/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Button } from '@instana/components';

import { Td } from 'in-components/tables/sharedComponents/Table';

import locals from './ActionColumn.mless';

export default function ActionCol({ cols, onClick, href, label }) {
  return (
    <Td colSpan={cols}>
      <div className={locals.wrapper}>
        <Button
          kind="action"
          href={href}
          onClick={
            onClick
              ? e => {
                  if (href == null) {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                  onClick();
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
