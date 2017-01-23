import React from 'react';

import {focusedDateInput$} from 'in-components/timeline/components/DatePicker/stores/focusedDateInput';
import {focusInput} from 'in-components/timeline/components/DatePicker/stores/focusedDateInput';
import {evaluateClassNames} from 'in-services/util/classnames';
import connectTo from 'in-hoc/connectTo';

import './TextInput.less';


const block = 'in-date-picker-text-input';

export default connectTo({
  focusedDateInput: focusedDateInput$
},
React.createClass({

  displayName: 'TextInput',

  componentDidMount() {
    this.checkFocus(this.props);
  },

  componentWillUpdate(nextProps) {
    this.checkFocus(nextProps);
  },

  render() {
    const inputIdToFocus = this.props.inputIdToFocus;
    const onChange = this.props.onChange;
    const heading = this.props.heading;
    const onBlur = this.props.onBlur;
    const value = this.props.value;

    return (
      <div className={evaluateClassNames({
             [block]: true,
             [`${block}--selected`]: this.props.focusedDateInput === inputIdToFocus
           })}>
        <span className={block + '__heading'}>
          {heading}
        </span>
        <br />
        <input type='text'
               className={`${block}__input`}
               value={value}
               onChange={e => onChange(e.target.value)}
               onFocus={() => inputIdToFocus ? focusInput(inputIdToFocus) : {}}
               onBlur={onBlur}
               ref={_input => this._input = _input} />
      </div>
    );
  },

  checkFocus(props) {
    const isSelected = props.focusedDateInput === props.inputIdToFocus;
    if (isSelected) {
      this._input.focus();
    }
  }
}));
