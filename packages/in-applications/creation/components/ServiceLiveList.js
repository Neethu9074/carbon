/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ServiceLiveListItem from 'in-applications/creation/components/ServiceLiveListItem';
import { LoadingIndicator } from 'in-new-components/LoadingIndicators';
import LightCard from 'in-new-components/Card/LightCard';
import { Ul } from 'in-new-components/lists/List';
import { t } from 'in-i18n';

import locals from './ServiceLiveList.mless';

export default function ServiceLiveList({ servicesLiveList, headerText, isValidTagFilterExpression }) {
  const isLoading = servicesLiveList?.progress && servicesLiveList.progress.loading;

  if (!isValidTagFilterExpression) {
    return (
      <LightCard
        className={locals.cardContainer}
        headerClassName={locals.header}
        title={headerText}
        withoutPadding
        framed
        darkFrame
      >
        <div className={locals.filtersPrompt}>{t('in-applications:creation.simple.liveList.queryIsInvalid')}</div>
      </LightCard>
    );
  }

  if (!isLoading && !servicesLiveList?.data?.items) {
    return (
      <LightCard
        className={locals.cardContainer}
        headerClassName={locals.header}
        title={headerText}
        withoutPadding
        framed
        darkFrame
      >
        <div className={locals.filtersPrompt}>{t('in-applications:creation.simple.liveList.addFiltersToBuild')}</div>
      </LightCard>
    );
  }

  return (
    <LightCard
      className={locals.cardContainer}
      headerClassName={locals.header}
      title={headerText}
      withoutPadding
      framed
      darkFrame
    >
      {isLoading === true ? (
        <LoadingIndicator size="xxxl" />
      ) : (
        <Ul framed={false}>
          {servicesLiveList?.data &&
            servicesLiveList.data.items.map(item => <ServiceLiveListItem item={item} key={item.id} />)}
        </Ul>
      )}
    </LightCard>
  );
}
