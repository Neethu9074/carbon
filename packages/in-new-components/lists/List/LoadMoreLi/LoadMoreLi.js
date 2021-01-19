/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { Li } from 'in-new-components/lists/List';
import Button from 'in-new-components/Button';

import locals from './LoadMoreLi.mless';

export default function LoadMoreLi({ className, loadMore, label = 'Load More' }) {
  return (
    <Li className={className}>
      <div className={locals.wrapper}>
        <Button
          kind="action"
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            loadMore();
          }}
        >
          {label}
        </Button>
      </div>
    </Li>
  );
}
