/* eslint-disable react/no-multi-comp */
import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import './TextInput.less';


const block = 'in-date-picker-text-input';
const rpt = React.PropTypes;

export default React.createClass({

  displayName: 'TextInput',

  mixins: [
    PureRenderMixin
  ],

  propTypes: {
    validationMessage: rpt.string.isRequired,
    heading: rpt.string.isRequired,
    onChange: rpt.func.isRequired,
    value: rpt.string.isRequired,
    isValid: rpt.bool.isRequired
  },

  render() {
    const props = this.props;

    const inputClassName =
      block + '__input' + (props.isValid ? '' : ' ' + block + '__input--invalid');

    return (
      <div className={block}>
        {props.isValid ?
          null :
          <div className={block + '__validation-panel'}>
            {props.validationMessage}
          </div>
        }
        <span className={block + '__heading'}>
          {props.heading}
        </span>
        <br />
        <input type='text'
               className={inputClassName}
               value={props.value}
               onChange={e => props.onChange(e.target.value)} />
      </div>
    );
  }
});
