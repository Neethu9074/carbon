import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import {getClassName} from 'in-services/react';

import './ListHeader.less';

const block = 'in-sidebar-listheader';

const ListHeader = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    header: React.PropTypes.string.isRequired,
    className: React.PropTypes.string
  },

  render() {
    return (
      <h2 className={getClassName(this, block)}>
        {this.props.header}
      </h2>
    );
  }
});

export default ListHeader;
