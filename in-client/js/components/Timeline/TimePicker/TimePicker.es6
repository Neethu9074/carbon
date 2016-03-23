import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import {getClassName} from 'in-services/react';
import connectTo from 'in-hoc/connectTo';
import Icon from 'in-components/Icon';

import {selectedTimePicker, setSelectedTimePicker, TIME_PICKER} from '../stores';
import FixedTimeWindowPicker from './FixedTimeWindowPicker';
import TimeRangePicker from './TimeRangePicker';

import './TimePicker.less';

const rpt = React.PropTypes;
const block = 'in-timepicker';

export default connectTo({
    selectedTimePicker
  },
  React.createClass({

    displayName: 'TimePicker',

    mixins: [
      PureRenderMixin
    ],

    propTypes: {
      selectedTimePicker: rpt.string,
      className: rpt.string
    },

    render() {
      const className = getClassName(this, block);
      return (
        <div className={className}>
          {this.props.selectedTimePicker === TIME_PICKER.FIXED ?
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
      const className = this.props.selectedTimePicker === type ?
        block + '__selection__selected' : block + '__selection';

      return (
        <div className={className}
             onClick={() => setSelectedTimePicker(type)}>
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
  })
);
