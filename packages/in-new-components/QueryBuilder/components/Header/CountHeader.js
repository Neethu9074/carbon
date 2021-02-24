/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { historicOrLargeDataResult$ } from 'in-new-components/time/TimeSelection/TimeSelection';
import { samplingIndicatorEnabled } from 'in-services/featureFlags';
import TimeIcon from 'in-new-components/time/TimeIcon';
import { emptyObject } from 'in-services/fixedObjects';
import useObservable from 'in-hooks/useObservable';
import { t } from 'in-i18n';

import locals from './CountHeader.mless';

export default function CountHeader({
  topText,
  totalHits,
  totalRepresentedItemCount,
  getHitName,
  getItemName,
  withSamplingTooltip = false
}) {
  if (totalHits == null && totalRepresentedItemCount == null) {
    return <Placeholder />;
  }
  const hitName = getHitName ? getHitName({ count: totalHits }) : null;
  const itemName =
    getItemName && totalRepresentedItemCount != null ? getItemName({ count: totalRepresentedItemCount }) : null;
  return <Presenter topText={topText ?? hitName} bottomText={itemName} withSamplingTooltip={withSamplingTooltip} />;
}

function Placeholder() {
  return <Presenter topText={t('in-new-components:analyzeView.resultHeaderLoading')} bottomText="&nbsp;" />;
}

function Presenter({ topText, bottomText, withSamplingTooltip }) {
  const historicOrLargeDataResult = useObservable(
    withSamplingTooltip && !samplingIndicatorEnabled ? historicOrLargeDataResult$ : null,
    [withSamplingTooltip]
  );
  const { containsHistoricData, retention } = historicOrLargeDataResult ?? emptyObject;
  return (
    <div className={locals.headerWithTooltip}>
      <div className={locals.header}>
        <h3 className={locals.groupCount}>{topText}</h3>
        {bottomText && <span className={locals.itemCount}>{bottomText}</span>}
      </div>
      {containsHistoricData && (
        <TimeIcon
          theme="light"
          tooltipTheme="dark"
          tooltipAlign="rightMiddle"
          containsHistoricData
          retention={retention}
        />
      )}
    </div>
  );
}
