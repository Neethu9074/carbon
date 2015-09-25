import {IntlMixin} from 'react-intl';
import React from 'react/addons';

import {getClassName} from 'in-services/react';

import Button from '../Button';

import './TimePicker.less';

const rpt = React.PropTypes;
const block = 'in-timepicker';

const TimePicker = React.createClass({
  mixins: [
    React.addons.PureRenderMixin,
    IntlMixin
  ],

  propTypes: {
    className: rpt.any,
    onClick: rpt.func.isRequired
  },

  render() {
    return (
      <div className={getClassName(this, block)}>
      <Button className={block + '__button'}
              onClick={() => this.props.onClick(1000 * 60 * 10)}>
         {this.getIntlMessage('timePicker.time1')}
      </Button>
      <Button className={block + '__button'}
              onClick={() => this.props.onClick(1000 * 60 * 60)}>
         {this.getIntlMessage('timePicker.time2')}
      </Button>
      <Button className={block + '__button'}
              onClick={() => this.props.onClick(1000 * 60 * 60 * 12)}>
         {this.getIntlMessage('timePicker.time3')}
      </Button>
      <Button className={block + '__button'}
              onClick={() => this.props.onClick(1000 * 60 * 60 * 24)}>
         {this.getIntlMessage('timePicker.time4')}
      </Button>
      </div>
    );
  }
});

export default TimePicker;
