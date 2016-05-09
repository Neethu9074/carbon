import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import Entity from 'in-components/tableView/components/Entity';

import './Group.less';


const block = 'in-table-view-group';
const rpt = React.PropTypes;

export default React.createClass({

  displayName: 'Group',

  mixins: [
    PureRenderMixin
  ],

  propTypes: {
    snapshotId: rpt.string.isRequired,
    hosts: irpt.list.isRequired
  },

  getInitialState() {
    return {
      isOpen: false
    };
  },

  render() {
    const hosts = this.props.hosts;

    return (
      <div className={block}
           onClick={this.toggleIsOpen}>
        {'group: ' + this.props.snapshotId}
        {this.state.isOpen ?
          hosts.map(host =>
            <Entity key={host.get('id')}
            snapshotId={host.get('id')} />
          )
          : null
        }
      </div>
    );
  },

  toggleIsOpen() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
});
