import React from 'react';

import {evaluateClassNames} from 'in-services/util/classnames';
import Tooltip from 'in-components/Tooltip';
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
             [`${block}--invalid`]: !isValid.isValid
           })}
           value={value}
           onChange={e => onChange(e.target.value)} />
  );

  let component = input;

  if (showInputDescriptions) {
    component = (
      <div>
        <span className={`${block}__heading`}>
          {heading}
        </span>
        <br />
        {input}
      </div>
    );
  }

  return (
    <Tooltip content={isValid.isValid ? null : isValid.error}
             align='rightMiddle'>
      {component}
    </Tooltip>
  );
});
