

import React from 'react/addons';

import './Content.less';

export default React.createClass({

  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    className: React.PropTypes.string,
    children: React.PropTypes.any.isRequired
  },

  render() {
    let classes = 'in-tooltip__content';
    if (this.props.className) {
      classes += ' ' + this.props.className;
    }

    return (
      <p className={classes}>
        {this.props.children}
      </p>
    );
  }
});
