/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Li } from '@instana/components';

import Skeleton from 'in-new-components/Loading/Skeleton';

import locals from './LoadingSkeletonLi.mless';

const loadingRowSkeletonDimensions = [90, 40, 70];

export default function LoadingSkeletonLi() {
  return (
    <>
      {loadingRowSkeletonDimensions.map((dimension, i) => (
        <Li key={i}>
          <Skeleton className={locals.skeleton} style={{ width: `${dimension}%` }} />
        </Li>
      ))}
    </>
  );
}
