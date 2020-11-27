import React from 'react';

import { number } from 'in-services/formatters/number';

import locals from './CountHeader.mless';

export default function CountHeader({ topText, totalHits, totalRepresentedItemCount, hitName, itemName }) {
  if (!totalHits && !topText) {
    return <Placeholder itemName={itemName} />;
  }
  const hitPlural = `${hitName}s`;
  const itemPlural = `${itemName}s`;
  return (
    <Presenter
      topText={topText ?? `${number.compact(totalHits)} ${totalHits != 1 ? hitPlural : hitName}`}
      bottomText={
        itemName &&
        `${number.compact(totalRepresentedItemCount)} ${totalRepresentedItemCount != 1 ? itemPlural : itemName}`
      }
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
