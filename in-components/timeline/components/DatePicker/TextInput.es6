/* eslint-disable react/no-multi-comp */
import PureRenderMixin from 'react-addons-pure-render-mixin';
import 'react-day-picker/lib/style.css';
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
    const inputClassName = block + '__input' +
                      (this.props.isValid ? '' : ' ' + block + '__input--invalid');

    return (
      <div className={block}>
        {this.props.isValid ?
          null :
          <div className={block + '__validation-panel'}>
            {this.props.validationMessage}
          </div>
        }
        <span className={block + '__heading'}>
          {this.props.heading}
        </span>
        <br/>
        <input type='text'
               className={inputClassName}
               value={this.props.value}
               onChange={e => this.props.onChange(e.target.value)}/>
      </div>
    );
  }
});
