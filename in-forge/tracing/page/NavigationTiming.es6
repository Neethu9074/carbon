import React from 'react';

import {msZeroDecimalPlaces} from 'in-services/formatters/number';
import createScale from 'in-charts/scale';

import './NavigationTiming.less';

const block = 'in-navigation-timing-vertical';
const timings = [
  {
    prop: 'unl',
    label: 'Unload'
  }, {
    prop: 'red',
    label: 'Redirect'
  }, {
    prop: 'apc',
    label: 'AppCache'
  }, {
    prop: 'dns',
    label: 'DNS'
  }, {
    prop: 'tcp',
    label: 'TCP'
  }, {
    prop: 'req',
    label: 'Request'
  }, {
    prop: 'rsp',
    label: 'Response'
  }, {
    prop: 'pro',
    label: 'Processing'
  }, {
    prop: 'loa',
    label: 'Load'
  }
];

export default function NavigationTiming(props) {
  let totalTime = 0;
  for (let i = 0, len = timings.length; i < len; i++) {
    totalTime += props[timings[i].prop] || 0;
  }

  const scale = createScale();
  scale.setRangeFrom(0);
  scale.setRangeTo(100);
  scale.setDomainFrom(0);
  scale.setDomainTo(totalTime);

  let elapsedTime = 0;
  return (
    <dl className={block}>
      {timings.map(timing => {
        const time = props[timing.prop] || 0;
        const offset = scale.getRange(elapsedTime);
        const width = scale.getRange(time);
        elapsedTime += time;

        return (
          <div key={timing.prop}
               className={`${block}__timings`}>
            <dt className={`${block}__label`}>
              {timing.label}
            </dt>
            <dd className={`${block}__time`}>
              {msZeroDecimalPlaces(time)}
            </dd>
            <div className={`${block}__indicator-wrapper`}>
              <div style={{
                     left: `${offset}%`,
                     width: `${width}%`
                   }}
                   className={`${block}__indicator`} />
            </div>
          </div>
        );
      })}
    </dl>
  );
}
