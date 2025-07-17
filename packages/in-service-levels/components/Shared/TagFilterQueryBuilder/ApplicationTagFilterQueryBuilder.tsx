/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import type { ApplicationQueryProps } from 'in-service-levels/components/Shared/TagFilterQueryBuilder/types';
import { useApplicationQueryBuilder } from 'in-service-levels/hooks/useApplicationQueryBuilder';

export default function ApplicationTagFilterQueryBuilder({
  applicationId,
  boundaryScope,
  readOnly,
  onChange,
  value
}: ApplicationQueryProps) {
  const { QueryBuilder } = useApplicationQueryBuilder({
    applicationId,
    boundaryScope
  });

  return <QueryBuilder value={value} readOnly={readOnly} onChange={onChange} />;
}
