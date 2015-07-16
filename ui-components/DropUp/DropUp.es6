'use strict';

import React from 'react/addons';
import Button from '../Button';
import Icon from '../Icon';

import './DropUp.less';

const rpt = React.PropTypes;
const block = 'in-dropup';

const DropUp = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    className: rpt.any,
    onClick: rpt.func,
    children: rpt.any.isRequired,
    header: rpt.string.isRequired
  },

  renderItems() {
    return (
      <ul>
        {this.props.children.map(child =>
          <li key={child}>
            <Button className={block + '__button-from'}
                    onClick={() => this.props.onClick(child)}>
              {child}
            </Button>
          </li>
        )}
      </ul>
    );
  },

  render() {
    let classes = block;
    if (this.props.className) {
      classes += ' ' + this.props.className;
    }

    const iconConfig = {
      type: 'timeline_warning'
    };

    return (
      <div className={block}>
        <ul>
          <li>
            <Icon className={block + '__icon'} type={iconConfig.type} />
            {this.props.header}
            {this.renderItems()}
          </li>
        </ul>
      </div>
    );
  }
});

export default DropUp;
