/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Li, LoadingSkeleton, Ul } from '@instana/components';

import locals from 'in-service-levels/components/SloList/components/SloEntityTable.mless';

export default function TableSkeleton() {
  return (
    <Ul>
      <Li>
        <LoadingSkeleton className={locals.loadSkeleton} />
      </Li>
      <Li>
        <LoadingSkeleton className={locals.loadSkeleton} />
      </Li>
      <Li>
        <LoadingSkeleton className={locals.loadSkeleton} />
      </Li>
      <Li>
        <LoadingSkeleton className={locals.loadSkeleton} />
      </Li>
      <Li>
        <LoadingSkeleton className={locals.loadSkeleton} />
      </Li>
    </Ul>
  );
}
