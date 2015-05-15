'use strict';

import './ServerItem.less';

import React from 'react/addons';
import classnames from 'instana-ui-services/util/classnames';
import {formatBytes} from 'instana-ui-services/converters';
import eventBus from 'instana-ui-services/eventbus';
import SubscriptionMixin from 'instana-ui-services/util/SubscriptionMixin';
import {getZone} from 'instana-ui-sdk/zones';
import {getColor} from 'instana-ui-sdk/zones';

import Icon from '../components/Icon';
import SnapshotIcon from '../components/SnapshotIcon';

const ServerItem = React.createClass({
  mixins: [SubscriptionMixin, React.addons.PureRenderMixin],

  getInitialState() {
    return {
      open: false
    };
  },

  render() {
    const snap = this.props.snapshot.get('snapshot');
    const color = getColor(getZone(this.props.snapshot));

    const liClasses = classnames({
      'in-sidebar-server-listing__snapshot': true,
      'in-sidebar-server-listing__snapshot--open': this.state.open
    });


    return (
      <li className={liClasses}>
        <h2 className='in-sidebar-server-listing__snapshot-label'
            onClick={this.focus}>
          <SnapshotIcon snapshot={this.props.snapshot} />
          {this.props.snapshot.get('hostId')}

          <Icon type={this.state.open ? 'chevron-up' : 'chevron-down'}
                className='in-sidebar-server-listing__snapshot-toggle'
                onClick={this.toggle}
                style={{borderColor: color}}/>
        </h2>

        <dl className='in-sidebar-server-listing__listing'>
          <dt>OS</dt>
          <dd>
            {snap.get('os.name')} {snap.get('os.version')}
          </dd>

          <dt>CPU</dt>
          <dd>
            {snap.get('cpu.count')}x{snap.get('cpu.model')}
          </dd>

          <dt>MEM</dt>
          <dd>
            {formatBytes(snap.get('memory.total'))}
          </dd>
        </dl>
      </li>
    );
  },

  toggle(e) {
    e.stopPropagation();
    this.setState({
      open: !this.state.open
    });
  },

  focus() {
    eventBus.emit('focus', {
      snapshot: this.props.snapshot,
      zoom: true
    });
  }
});

export default ServerItem;
