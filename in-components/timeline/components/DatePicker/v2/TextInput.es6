import React from 'react';

import './TextInput.less';


const block = 'in-date-picker-text-input';

export default function TextInput({heading, value, onChange, showInputDescriptions}) {
  function Input() {
    return (
      <input type='text'
             className={`${block}__input`}
             value={value}
             onChange={e => onChange(e.target.value)} />
    );
  }

  if (!showInputDescriptions) {
    return <Input />;
  }
  return (
    <div className={block}>
      <span className={block + '__heading'}>
        {heading}
      </span>
      <br />
      <Input />
    </div>
  );
}
