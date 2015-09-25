import React from 'react/addons';

import {getClassName} from 'in-services/react';

import './Content.less';

export default React.createClass({

  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    className: React.PropTypes.string,
    children: React.PropTypes.any.isRequired
  },

  render() {
    return (
      <p className={getClassName(this, 'in-tooltip__content')}>
        {this.props.children}
      </p>
    );
  }
});
