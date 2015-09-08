import React from 'react/addons';

import Icon from '../Icon';

import './HoverButton.less';

const rpt = React.PropTypes;
const block = 'in-hover-button';

const HoverButton = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    icon: rpt.string.isRequired,
    children: rpt.any,
    onClick: rpt.func.isRequired,
    className: rpt.string
  },

  render() {
    let classes = block;
    if (this.props.className) {
      classes += ' ' + this.props.className;
    }

    return (
      <button className={classes}
              onClick={this.props.onClick}>
        <Icon type={this.props.icon}
              className={block + '__icon'}/>
        <span className={block + '__label'}>
          {this.props.children}
        </span>
      </button>
    );
  }
});

export default HoverButton;
