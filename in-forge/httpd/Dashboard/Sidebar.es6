import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import Collapsible from 'in-components/Collapsible';
import RunningComponentsList from 'in-components/RunningComponentsList';

import HttpdInfo from '../HttpdInfo';

const Sidebar = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    return (
      <div>
        <Collapsible initiallyOpen={true}>
          <Collapsible.Header>Apache Httpd</Collapsible.Header>
          <Collapsible.Content>
            <HttpdInfo snapshot={this.props.snapshot} />
          </Collapsible.Content>
        </Collapsible>
        <RunningComponentsList snapshot={this.props.snapshot} />
      </div>
    );
  }

});

export default Sidebar;
