/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import { Ul, Button } from '@instana/components';

import ServiceLiveListItem from 'in-applications/creation/components/ServiceLiveListItem';
import { LoadingIndicator } from 'in-components/LoadingIndicators';
import LightCard from 'in-alerting/components/LightCard/LightCard';
import { t } from 'in-i18n';

import locals from './ServiceLiveList.mless';

export default function ServiceLiveList({
  servicesLiveList,
  headerText,
  isValidTagFilterExpression,
  isContributorRole,
  pageSize = 10
}) {
  const [visibleItems, setVisibleItems] = useState(pageSize);
  const isLoading = servicesLiveList?.progress && servicesLiveList.progress.loading;

  const handleLoadMore = event => {
    event.preventDefault();
    setVisibleItems(prevVisibleItems => prevVisibleItems + 10);
  };

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
            servicesLiveList.data.items
              .slice(0, isContributorRole ? visibleItems : servicesLiveList.data.items?.length)
              .map(item => <ServiceLiveListItem item={item} key={item.id} />)}
          <div className={locals.center}>
            {isContributorRole && visibleItems < (servicesLiveList.data.items?.length ?? 0) && (
              <Button kind="action" onClick={handleLoadMore}>
                {t('in-synthetics:dialog.createTest.advancedMode.loadMore')}
              </Button>
            )}
          </div>
        </Ul>
      )}
    </LightCard>
  );
}
