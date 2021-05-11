/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Button } from '@instana/components';
import { Li } from '@instana/components';

import { t } from 'in-i18n';

import locals from './LoadMoreLi.mless';

export default function LoadMoreLi({ className, loadMore, label = t('in-new-components:list.labelLoadMore') }) {
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
