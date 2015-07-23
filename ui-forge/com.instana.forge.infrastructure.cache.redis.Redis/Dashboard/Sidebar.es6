'use strict';

import React from 'react/addons';
import irpt from 'react-immutable-proptypes';

import {getLabel} from 'instana-ui-sdk/snapshot';

import Panel from 'instana-ui-components/Panel';
import SidebarHeading from 'instana-ui-components/SidebarHeading';
import SidebarSubheading from 'instana-ui-components/SidebarSubheading';
import RedisInfo from '../RedisInfo';

const rpt = React.PropTypes;
const RedisSidebar = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    timeframe: rpt.number.isRequired,
    width: rpt.number.isRequired
  },

  render() {
    return (
      <div>
        <SidebarHeading>
          Redis Details
        </SidebarHeading>
        <SidebarSubheading>
          {getLabel(this.props.snapshot)}
        </SidebarSubheading>

        <Panel title='Redis'>
          <RedisInfo snapshot={this.props.snapshot} />
        </Panel>
      </div>
    );
  }

});

export default RedisSidebar;
