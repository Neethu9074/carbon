/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import {
  isApplicationTagFilter,
  isWebsiteTagFilterQueryBuilder
} from 'in-service-levels/components/Shared/TagFilterQueryBuilder/types';
import ApplicationTagFilterQueryBuilder from 'in-service-levels/components/Shared/TagFilterQueryBuilder/ApplicationTagFilterQueryBuilder';
import WebsiteTagFilterQueryBuilder from 'in-service-levels/components/Shared/TagFilterQueryBuilder/WebsiteTagFilterQueryBuilder';
import type { TagFilterQueryBuilderProps } from 'in-service-levels/components/Shared/TagFilterQueryBuilder/types';
import { ServiceLevelErrors } from 'in-service-levels/constants';

export default function TagFilterQueryBuilder(props: TagFilterQueryBuilderProps) {
  if (isApplicationTagFilter(props)) return <ApplicationTagFilterQueryBuilder {...props} />;

  if (isWebsiteTagFilterQueryBuilder(props)) return <WebsiteTagFilterQueryBuilder {...props} />;

  throw new Error(ServiceLevelErrors.UNHANDLED_SLO_ENTITY_TYPE);
}
