import React from 'react';

import TimelineTimestamp from 'in-components/timeline/components/TimelineTimestamp';
import {evaluateClassNames} from 'in-services/util/classnames';
import {bigBangTimestamp$} from 'in-stores/timeline';
import {serverTime$} from 'in-stores/serverTime';
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
             [`${block}--invalid`]: !isValid
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
    <Tooltip content={isValid ? null : <ErrorMsg />}
             align='rightMiddle'>
      {component}
    </Tooltip>
  );
});

const ErrorMsg = connectTo({
  bigBangTimestamp: bigBangTimestamp$,
  serverTime: serverTime$
},
function ErrorMsg({bigBangTimestamp, serverTime}) {
  return (
    <div>
      <span>
        Please enter a date within the monitored time range in the format (YYYY-MM-DD)
      </span>
      <br />
      <span className={`${block}__timerange`}>
        The monitored time range is from
        <TimelineTimestamp className={`${block}__timestamp`}
                           timestamp={bigBangTimestamp}
                           type='white' />
        to
        <TimelineTimestamp className={`${block}__timestamp`}
                           timestamp={serverTime}
                           type='white' />
      </span>
    </div>
  );
});
