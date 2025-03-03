/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

// @ts-expect-error
import Pods from 'in-kubernetes/Dashboards/CronJob/PodList';
import JobItem from 'in-kubernetes/Dashboards/CronJob/JobItem/JobItem';

interface JobListItemProps {
  items: any;
  podProps: any;
  lastAccessedPodId?: string;
}

function JobListItems({ items, lastAccessedPodId, podProps }: JobListItemProps) {
  return items.map((item: any, index: number) => (
    <JobItem
      key={`${item.label}-${index}`}
      item={item}
      initiallyOpen={item.podIds.length > 0 && item.podIds.includes(lastAccessedPodId)}
      renderNestedContent={() => <Pods {...podProps} jobId={item.job.id} />}
      toggleContentOnRowClick
      roundShadow
    />
  ));
}

export default JobListItems;
