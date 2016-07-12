import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import getForgeComponent from 'in-services/getForgeComponent';
import {getClassName} from 'in-services/react';
import Jail from 'in-components/Jail';

import './SidebarDetailList.less';


const block = 'in-sidebar-detail-list';
const rpt = React.PropTypes;

export default React.createClass({

  displayName: 'SidebarDetailList',

  mixins: [PureRenderMixin],

  propTypes: {
    useDetailedInformation: rpt.bool,
    snapshot: irpt.map.isRequired,
    className: rpt.string,
    style: rpt.object
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
