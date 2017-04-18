import PureRenderMixin from 'react-addons-pure-render-mixin';
import rpt from 'prop-types';
import React from 'react';

import { getClassName } from 'in-services/react';

import './Content.less';

export default React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    className: rpt.string,
    children: rpt.any.isRequired
  },

  render() {
    return (
      <div className={getClassName(this, 'in-tooltip__content')}>
        {this.props.children}
      </div>
    );
  }
});
