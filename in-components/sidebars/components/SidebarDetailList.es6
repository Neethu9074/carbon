import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import getForgeComponent from 'in-services/getForgeComponent';
import {getClassName} from 'in-services/react';
import Jail from 'in-components/Jail';

import './SidebarDetailList.less';


const block = 'in-sidebar-detail-list';

const SidebarDetailList = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    useDetailedInformation: React.PropTypes.bool,
    className: React.PropTypes.string,
    style: React.PropTypes.object,
    snapshot: irpt.map.isRequired
  },

  render() {
    const snapshot = this.props.snapshot;

    return (
      <div className={getClassName(this, block)}
           style={this.props.style}>
        <Jail component={this.getForgeSpecificComponent('Details')}
              props={{ snapshot }}/>
      </div>
    );
  },

  getForgeSpecificComponent(name) {
    const plugin = this.props.snapshot.get('plugin');
    const path = this.props.useDetailedInformation ?
      './' + plugin + '/Dashboard/Sidebar.es6' :
      './' + plugin + '/Sidebar/' + name + '.es6';

    return getForgeComponent(path);
  }
});

export default SidebarDetailList;
