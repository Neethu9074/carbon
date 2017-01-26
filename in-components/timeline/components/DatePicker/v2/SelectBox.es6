import React from 'react';

import './SelectBox.less';


const block = 'in-date-picker-select-box';

export default function SelectBox({heading, value, values, onChange}) {
  const containsValue = values.indexOf(value) >= 0;

  return (
    <div className={block}>
      <span className={block + '__heading'}>
        {heading}
      </span>
      <br />
      <select className={block + '__select'}
              onChange={e => onChange(e.target.value)}
              value={value}>
        {!containsValue ?
          <option key={value}
                  value={value}>
            {value}
          </option>
          : null
        }
        {values.map(_value => {
          return (
            <option key={_value}
                    value={_value}>
              {_value}
            </option>
          );
        })}
      </select>
    </div>
  );
}
