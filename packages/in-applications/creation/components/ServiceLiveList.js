/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ServiceLiveListItem from 'in-applications/creation/components/ServiceLiveListItem';
import { LoadingIndicator } from 'in-new-components/LoadingIndicators';

import locals from './ServiceLiveList.mless';

export default function ServiceLiveList({ servicesLiveList, headerText }) {
  const isLoading = servicesLiveList?.progress && servicesLiveList.progress.loading;

  if (!servicesLiveList?.data?.items) {
    return (
      <div className={locals.listContainer}>
        <div className={locals.listHeader}>
          <div className={locals.listHeaderText}>{headerText}</div>
        </div>
        <div className={locals.filtersPrompt}>Add filters to build your Application Perspective</div>
      </div>
    );
  }

  return (
    <div className={locals.listContainer}>
      <div className={locals.listHeader}>
        <div className={locals.listHeaderText}>{headerText}</div>
      </div>
      {isLoading === true ? (
        <LoadingIndicator size="xxxl" />
      ) : (
        <ul className={locals.listWrapper}>
          {servicesLiveList?.data &&
            servicesLiveList.data.items.map(item => <ServiceLiveListItem item={item} key={item.id} />)}
        </ul>
      )}
    </div>
  );
}
