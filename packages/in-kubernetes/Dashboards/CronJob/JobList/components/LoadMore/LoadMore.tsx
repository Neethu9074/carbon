/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { LiLoadMore } from '@instana/components';

interface LoadMoreProps {
  loadMore: () => {};
  canLoadMore: boolean;
  label?: string;
}

function LoadMore({ canLoadMore, label = '', ...restProps }: LoadMoreProps) {
  if (!canLoadMore) {
    return null;
  }

  return <LiLoadMore label={label} {...restProps} />;
}

export default LoadMore;
