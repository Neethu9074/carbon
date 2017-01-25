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

    return (
      <div className={evaluateClassNames({
             [block]: true,
             [`${block}--selected`]: this.props.focusedDateInput === inputIdToFocus
           })}>
        <span className={block + '__heading'}>
          {this.props.heading}
        </span>
        <br />
        <input type='text'
               className={`${block}__input`}
               value={this.props.value}
               onChange={e => this.props.onChange(e.target.value)}
               onFocus={() => inputIdToFocus ? focusInput(inputIdToFocus) : {}}
               onBlur={this.props.onBlur}
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
