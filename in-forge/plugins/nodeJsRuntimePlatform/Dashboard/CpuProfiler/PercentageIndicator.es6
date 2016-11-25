import React from 'react';

import {percentageTwoDecimalPlaces} from 'in-services/formatters/number';
import {msTwoDecimalPlaces} from 'in-services/formatters/number';

import './PercentageIndicator.less';

const formatter = d => msTwoDecimalPlaces(d / 1000);

const block = 'in-nodejs-percentage-indicator';

export default function PercentageIndicator({p, v}) {
  return (
    <div className={block}>
      <div className={`${block}__indicator-bar`}
           style={{width: `${p * 100}%`}} />

      <div className={`${block}__content`}>
        <span className={`${block}__value`}>
          {formatter(v)}
        </span>

        <span className={`${block}__percentage`}>
          {isNaN(p) ? '' : percentageTwoDecimalPlaces(p)}
        </span>
      </div>
    </div>
  );
}
