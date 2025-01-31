/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { ColumnizedContent, Li } from '@instana/components';
import { KubernetesJobListItem } from '@instana/types';

import { labelColumnDefinitions, columnDefinitions } from 'in-kubernetes/Dashboards/CronJob/JobItem/utils';

import locals from 'in-kubernetes/Dashboards/CronJob/JobItem/JobItem.mless';

export interface JobItemProps {
  item: KubernetesJobListItem;
  initiallyOpen: boolean;
  roundShadow: boolean;
  toggleContentOnRowClick: boolean;
  renderNestedContent: () => React.ReactNode;
}

function JobItem(props: JobItemProps) {
  const { item } = props;
  return (
    <Li {...props}>
      <div className={locals.list}>
        <div className={locals.label}>
          <ColumnizedContent {...props} columnDefinitions={labelColumnDefinitions} item={item.job} />
        </div>
        <div className={locals.metrics}>
          <ColumnizedContent columnDefinitions={columnDefinitions} {...item} />
        </div>
      </div>
    </Li>
  );
}

export default JobItem;
