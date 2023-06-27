/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Li, LoadingSkeleton, Ul } from '@instana/components';

import locals from './SloEntityTableSkeleton.mless';

export default function SloEntityTableSkeleton() {
  return (
    <Ul>
      <Li>
        <LoadingSkeleton className={locals.loadingSkeleton} />
      </Li>
      <Li>
        <LoadingSkeleton className={locals.loadingSkeleton} />
      </Li>
      <Li>
        <LoadingSkeleton className={locals.loadingSkeleton} />
      </Li>
      <Li>
        <LoadingSkeleton className={locals.loadingSkeleton} />
      </Li>
      <Li>
        <LoadingSkeleton className={locals.loadingSkeleton} />
      </Li>
    </Ul>
  );
}
