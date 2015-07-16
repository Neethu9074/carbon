'use strict';

import React from 'react/addons';
import Button from '../Button';

import './TimePicker.less';

const rpt = React.PropTypes;
const block = 'in-timepicker';

const TimePicker = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    className: rpt.any,
    onClick: rpt.func.isRequired
  },

  render() {
    let classes = block;
    if (this.props.className) {
      classes += ' ' + this.props.className;
    }

    return (
      <div className={block}>
      <Button className={block + '__button'}
              onClick={() => this.props.onClick('item 1')}>
         item 1
      </Button>
      <Button className={block + '__button'}
              onClick={() => this.props.onClick('item 2')}>
         item 2
      </Button>
      <Button className={block + '__button'}
              onClick={() => this.props.onClick('item 3')}>
         item 3
      </Button>
      </div>
    );
  }
});

export default TimePicker;
