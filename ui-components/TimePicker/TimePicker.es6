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
         10 minutes
      </Button>
      <Button className={block + '__button'}
              onClick={() => this.props.onClick('item 2')}>
         1 hour
      </Button>
      <Button className={block + '__button'}
              onClick={() => this.props.onClick('item 3')}>
         12 hours
      </Button>
      <Button className={block + '__button'}
              onClick={() => this.props.onClick('item 4')}>
         24 hours
      </Button>
      </div>
    );
  }
});

export default TimePicker;
