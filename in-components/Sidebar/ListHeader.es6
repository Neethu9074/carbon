import React from 'react/addons';

import './ListHeader.less';

const block = 'in-sidebar-listheader';

const ListHeader = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    header: React.PropTypes.string.isRequired,
    className: React.PropTypes.string
  },

  render() {
    const className = this.props.className ? block + ' ' + this.props.className : block;

    return (
      <h2 className={className}>
        {this.props.header}
      </h2>
    );
  }
});

export default ListHeader;
