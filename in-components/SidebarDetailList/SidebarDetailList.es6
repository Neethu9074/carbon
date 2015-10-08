import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import getForgeComponent from 'in-services/getForgeComponent';
import {getClassName} from 'in-services/react';

import Jail from '../Jail';

import './SidebarDetailList.less';

const block = 'in-sidebar-detail-list';

const SidebarDetailList = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    useDetailedInformation: React.PropTypes.bool,
    className: React.PropTypes.string,
    snapshot: irpt.map.isRequired
  },

  render() {
    const snapshot = this.props.snapshot;

    return (
      <div className={getClassName(this, block)}
           style={{ maxHeigt: window.height }}>
        <Jail component={this.getForgeSpecificComponent('Details')}
              props={{ snapshot }}/>
      </div>
    );
  },

  getForgeSpecificComponent(name) {
    const pluginId = this.props.snapshot.get('pluginId');
    const path = this.props.useDetailedInformation ?
      './' + pluginId + '/Dashboard/Sidebar.es6' :
      './' + pluginId + '/Sidebar/' + name + '.es6';

    return getForgeComponent(path);
  }
});

export default SidebarDetailList;
