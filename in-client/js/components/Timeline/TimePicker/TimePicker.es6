import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import throttleNextFrame from 'in-services/util/throttleNextFrame';
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
const MAX_MILLIS_FOR_CLICK = 300;

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
      this.downTime = 0;
      this.upTime = 0;
      this.onMouseUp = throttleNextFrame(this.onMouseUp);
      this.onMouseDown = throttleNextFrame(this.onMouseDown);

      window.addEventListener('mouseup', this.onMouseUp, false);
      window.addEventListener('mousedown', this.onMouseDown, false);
    },

    componentWillUnmount() {
      window.removeEventListener('mousedown', this.onMouseDown, false);
      window.removeEventListener('mouseup', this.onMouseUp, false);
    },

    render() {
      const className = getClassName(this, block);
      return (
        <div className={className}
             ref='timepicker'>
          {this.props.selectedTimePicker === TIME_PICKER.FIXED ?
            <FixedTimeWindowPicker /> :
            <TimeRangePicker />
          }

          <div className={block + '__selection-panel'}>
            {this.createSelection(TIME_PICKER.LIVE,
                                  'metrics',
                                  'Live View',
                                  'All information is updated each second for the selected time window after now.')
            }
            {this.createSelection(TIME_PICKER.FIXED,
                                  'metrics',
                                  'Time Range',
                                  'Drill down into a selected time range. ' +
                                  'Map shows status of the environment at the selected end time.')
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

    onMouseUp(e) {
      // we are doing this asynchronously and the timepicker may already be gone
      if (!this.refs.timepicker) {
        return;
      }

      this.upTime = Date.now();

      const delta = this.upTime - this.downTime;
      if (delta > MAX_MILLIS_FOR_CLICK) {
        return;
      }

      const rect = this.refs.timepicker.getBoundingClientRect();
      if (e.clientX > rect.right || e.clientX < rect.left ||
          e.clientY < rect.top || e.clientY > rect.bottom) {
        // the click was donw outside this component so close it
        this.props.onClose();
      }
    },

    onMouseDown() {
      this.downTime = Date.now();
    }
  })
);
