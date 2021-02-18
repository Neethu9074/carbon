/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';
import { t } from 'in-i18n';

import { historicOrLargeDataResult$ } from 'in-new-components/time/TimeSelection/TimeSelection';
import { samplingIndicatorEnabled } from 'in-services/featureFlags';
import { number } from 'in-services/formatters/number';
import TimeIcon from 'in-new-components/time/TimeIcon';
import { emptyObject } from 'in-services/fixedObjects';
import useObservable from 'in-hooks/useObservable';

import locals from './CountHeader.mless';

export default function CountHeader({
  topText,
  totalHits,
  totalRepresentedItemCount,
  hitName,
  itemName,
  withSamplingTooltip = false
}) {
  if (!totalHits && !topText) {
    return <Placeholder itemName={itemName} />;
  }
  const hitPlural = `${hitName}s`;
  const itemPlural = t(itemName, {
    count: totalRepresentedItemCount,
    formattedCount: number.compact(totalRepresentedItemCount)
  });
  return (
    <Presenter
      topText={topText ?? `${number.compact(totalHits)} ${totalHits != 1 ? hitPlural : hitName}`}
      bottomText={itemPlural}
      withSamplingTooltip={withSamplingTooltip}
    />
  );
}

function Placeholder({ itemName }) {
  return <Presenter topText="&nbsp;" bottomText={itemName && <>&nbsp;</>} />;
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
