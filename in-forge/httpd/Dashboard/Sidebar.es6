import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import Collapsible from 'in-components/Collapsible';
import RunningComponentsList from 'in-components/RunningComponentsList';

import HttpdInfo from '../HttpdInfo';

const Sidebar = React.createClass({
  mixins: [React.addons.PureRenderMixin],

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
