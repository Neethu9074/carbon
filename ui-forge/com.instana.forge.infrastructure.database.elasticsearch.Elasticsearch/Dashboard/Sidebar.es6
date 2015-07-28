'use strict';

import React from 'react/addons';
import irpt from 'react-immutable-proptypes';

import {getLabel} from 'instana-ui-sdk/snapshot';

import Panel from 'instana-ui-components/Panel';
import SidebarHeading from 'instana-ui-components/SidebarHeading';
import SidebarSubheading from 'instana-ui-components/SidebarSubheading';
import ElasticsearchInfo from '../ElasticsearchInfo';

const rpt = React.PropTypes;
const ElasticsearchSidebar = React.createClass({
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
          Elasticsearch Details
        </SidebarHeading>
        <SidebarSubheading>
          {getLabel(this.props.snapshot)}
        </SidebarSubheading>

        <Panel title='Elasticsearch'>
          <ElasticsearchInfo snapshot={this.props.snapshot} />
        </Panel>
      </div>
    );
  }

});

export default ElasticsearchSidebar;
