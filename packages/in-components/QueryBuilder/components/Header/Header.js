/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import CountHeader from 'in-components/QueryBuilder/components/Header/CountHeader';

import locals from './Header.mless';

export default function Header(props) {
  const {
    totalRepresentedItemCount,
    CustomHeaderActions,
    totalHits,
    totalRetainedItemCount,
    getHitName,
    getItemName,
    withAdjustedWindowSizeTooltip,
    withGrouping,
    withResultsInGroups,
    withCountHeader = true,
    hasErrors,
    isLoading,
    dataSource,
    renderHistoricDataIndicator = false,
    fastQueryModeEnabled
  } = props;

  return (
    <div className={locals.wrapper}>
      <HorizontalFlexWrapper>{CustomHeaderActions && <CustomHeaderActions {...props} />}</HorizontalFlexWrapper>

      {withCountHeader && (
        <CountHeader
          totalRepresentedItemCount={totalRepresentedItemCount}
          totalRetainedItemCount={totalRetainedItemCount}
          totalHits={totalHits}
          dataSource={dataSource}
          isLoading={isLoading}
          hasErrors={hasErrors}
          getItemName={getItemName}
          getHitName={getHitName}
          withAdjustedWindowSizeTooltip={withAdjustedWindowSizeTooltip}
          withGrouping={withGrouping}
          withResultsInGroups={withResultsInGroups}
          renderHistoricDataIndicator={renderHistoricDataIndicator}
          fastQueryModeEnabled={fastQueryModeEnabled}
        />
      )}
    </div>
  );
}
