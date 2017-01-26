import React from 'react';

import {formatDurationAccurately} from 'in-services/formatters/date';
import {slices} from 'in-components/timeline/timelineConfig';

import './SelectBox.less';


const block = 'in-date-picker-select-box';

export default function SelectBox({heading, value, onChange}) {
  const containsValue = slices.indexOf(value) >= 0;

  return (
    <div className={block}>
      <span className={block + '__heading'}>
        {heading}
      </span>
      <br />
      <select className={block + '__select'}
              onChange={e => onChange(Number(e.target.value))}
              value={value}>
        {!containsValue ?
          <option key={value}
                  value={value}>
            {formatDurationAccurately(value)}
          </option>
          : null
        }
        {slices.map(_value => {
          return (
            <option key={_value}
                    value={_value}>
              {formatDurationAccurately(_value)}
            </option>
          );
        })}
      </select>
    </div>
  );
}
