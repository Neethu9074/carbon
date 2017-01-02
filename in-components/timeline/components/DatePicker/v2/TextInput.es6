import React from 'react';

import './TextInput.less';


const block = 'in-date-picker-text-input';

export default function TextInput({heading, value, onChange, onFocus, onBlur}) {
  return (
    <div className={block}>
      <span className={block + '__heading'}>
        {heading}
      </span>
      <br />
      <input type='text'
             className={`${block}__input`}
             value={value}
             onChange={e => onChange(e.target.value)}
             onFocus={onFocus}
             onBlur={onBlur} />
    </div>
  );
}
