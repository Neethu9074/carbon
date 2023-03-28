/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import LoadingList from 'in-components/lists/List/sharedComponents/LoadingList';
import { NotFound } from 'in-kubernetes/Dashboards/CronJob/JobList/components';

interface LoadingProps {
  isLoading: boolean;
  numSkeletonRows: number;
  totalItems: number;
}

function Loading({ isLoading, numSkeletonRows, totalItems }: LoadingProps) {
  if (isLoading) {
    <LoadingList numSkeletonRows={numSkeletonRows} />;
  }

  if (!isLoading && !totalItems) {
    return <NotFound />;
  }

  return null;
}

export default Loading;
