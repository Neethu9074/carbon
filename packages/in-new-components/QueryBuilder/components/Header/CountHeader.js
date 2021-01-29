/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';
import { t } from 'in-i18n';

import { number } from 'in-services/formatters/number';

import locals from './CountHeader.mless';

export default function CountHeader({ topText, totalHits, totalRepresentedItemCount, hitName, itemName }) {
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
    />
  );
}

function Placeholder({ itemName }) {
  return <Presenter topText="&nbsp;" bottomText={itemName && <>&nbsp;</>} />;
}

function Presenter({ topText, bottomText }) {
  return (
    <div className={locals.header}>
      <h3 className={locals.groupCount}>{topText}</h3>
      {bottomText && <span className={locals.itemCount}>{bottomText}</span>}
    </div>
  );
}
