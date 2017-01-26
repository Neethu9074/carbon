import React from 'react';

import {evaluateClassNames} from 'in-services/util/classnames';
import connectTo from 'in-hoc/connectTo';

import './TextInput.less';


const block = 'in-date-picker-text-input';

export default connectTo(props => {
  return {
    isValid: props.isValid$
  };
},
function TextInput({isValid, heading, value, onChange, showInputDescriptions}) {
  const input = (
    <input type='text'
           className={evaluateClassNames({
             [`${block}__input`]: true,
             [`${block}--invalid`]: !isValid
           })}
           value={value}
           onChange={e => onChange(e.target.value)} />
  );

  if (!showInputDescriptions) {
    return input;
  }
  return (
    <div className={block}>
      <span className={block + '__heading'}>
        {heading}
      </span>
      <br />
      {input}
    </div>
  );
});
