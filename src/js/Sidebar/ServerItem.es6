'use strict';

import './ServerItem.less';

import React from 'react/addons';
import classnames from 'instana-ui-services/util/classnames';
import {formatBytes} from 'instana-ui-services/converters';
import eventBus from 'instana-ui-services/eventbus';
import SubscriptionMixin from 'instana-ui-services/util/SubscriptionMixin';
import {getZone} from 'instana-ui-sdk/zones';
import {getColor} from 'instana-ui-sdk/zones';

import Icon from 'instana-ui-components/Icon';
import SnapshotIcon from 'instana-ui-components/SnapshotIcon';

const ServerItem = React.createClass({
  mixins: [SubscriptionMixin, React.addons.PureRenderMixin],

  getInitialState() {
    return {
      open: false
    };
  },

  render() {
    const data = this.props.snapshot.get('data');
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
          {this.props.snapshot.getIn(['data', 'hostname'])}

          <Icon type={this.state.open ? 'chevron-up' : 'chevron-down'}
                className='in-sidebar-server-listing__snapshot-toggle'
                onClick={this.toggle}
                style={{borderColor: color}}/>
        </h2>

        <dl className='in-sidebar-server-listing__listing'>
          <dt>OS</dt>
          <dd>
            {data.get('os.name')} {data.get('os.version')}
          </dd>

          <dt>CPU</dt>
          <dd>
            {data.get('cpu.count')}x{data.get('cpu.model')}
          </dd>

          <dt>MEM</dt>
          <dd>
            {formatBytes(data.get('memory.total'))}
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
