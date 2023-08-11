/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { WebsiteQueryProps } from 'in-service-levels/components/Shared/TagFilterQueryBuilder/types';
import { useWebsiteQueryBuilder } from 'in-service-levels/hooks/useWebsiteQueryBuilder';

export const WebsiteTagFilterQueryBuilder = ({
  websiteId,
  beaconType,
  readOnly,
  onChange,
  value
}: WebsiteQueryProps) => {
  const { QueryBuilder } = useWebsiteQueryBuilder({ websiteId, beaconType });

  return <QueryBuilder value={value} readOnly={readOnly} onChange={onChange} />;
};
