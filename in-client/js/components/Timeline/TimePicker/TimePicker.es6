import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import {getClassName} from 'in-services/react';
import connectTo from 'in-hoc/connectTo';
import Icon from 'in-components/Icon';

import {
  selectedTimePicker,
  setSelectedTimePicker,
  TIME_PICKER
} from '../timelineStores';
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

    mouseIsOnTimePicker: false,

    mixins: [
      PureRenderMixin
    ],

    propTypes: {
      selectedTimePicker: rpt.string,
      onClose: rpt.func.isRequired,
      className: rpt.string
    },

    componentDidMount() {
      window.addEventListener('mouseup', this.handleClick, false);
    },

    componentWillUnmount() {
      window.removeEventListener('mouseup', this.handleClick, false);
    },

    render() {
      const className = getClassName(this, block);
      return (
        <div className={className}
             ref='myDiv'>
          {this.props.selectedTimePicker === TIME_PICKER.FIXED ?
            <FixedTimeWindowPicker /> :
            <TimeRangePicker />
          }

          <div className={block + '__selection-panel'}>
            {this.createSelection(TIME_PICKER.LIVE,
                                  'metrics',
                                  'Live View',
                                  'All information is updated each second for the selected time window after now')
            }
            {this.createSelection(TIME_PICKER.FIXED,
                                  'metrics',
                                  'Custom Timerange',
                                  'Drill down into a selected timerange. ' +
                                  'This only affects metrics. Map shows live state')
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
    },

    handleClick(e) {
      const rect = this.refs.myDiv.getBoundingClientRect();
      if (e.clientX > rect.right || e.clientX < rect.left ||
          e.clientY < rect.top || e.clientY > rect.bottom) {
        // the click was donw outside this component so close it
        this.props.onClose();
      }
    }
  })
);
