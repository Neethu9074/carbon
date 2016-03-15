import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import {getClassName} from 'in-services/react';
import Icon from 'in-components/Icon';

import FixedTimeWindowPicker from './FixedTimeWindowPicker';
import TimeRangePicker from './TimeRangePicker';

import './TimePicker.less';

const rpt = React.PropTypes;
const block = 'in-timepicker';
const TIME_PICKER = {
  FIXED: 'fixed',
  LIVE: 'range'
};

export default React.createClass({

  displayName: 'TimePicker',

  mixins: [
    PureRenderMixin
  ],

  propTypes: {
    className: rpt.any
  },

  getInitialState() {
    return {
      selectedtimePicker: TIME_PICKER.FIXED
    };
  },

  render() {
    const className = getClassName(this, block);
    return (
      <div className={className}>
        {this.state.selectedtimePicker === TIME_PICKER.FIXED ?
          <FixedTimeWindowPicker /> :
          <TimeRangePicker />
        }

        <div className={block + '__selection-panel'}>
          {this.createSelection(TIME_PICKER.LIVE,
                                'metrics',
                                'Live View',
                                'Weit hinten, hinter den Wortbergen, fern der Länder')
          }
          {this.createSelection(TIME_PICKER.FIXED,
                                'metrics',
                                'Custom Timerange',
                                'Weit hinten, hinter den Wortbergen, fern der Länder')
          }
        </div>
      </div>
    );
  },

  createSelection(type, iconType, heading, text) {
    const className = this.state.selectedtimePicker === type ?
      block + '__selection__selected' : block + '__selection';

    return (
      <div className={className}
           onClick={() => this.setState({ selectedtimePicker: type })}>
        <Icon className={block + '__icon'}
              type={iconType} />
        <div>
          <p className={block + '__heading'}>
          {heading}
          </p>
          <span className={block + '__text'}>
          {text}
          </span>
        </div>
      </div>
    );
  }
});
