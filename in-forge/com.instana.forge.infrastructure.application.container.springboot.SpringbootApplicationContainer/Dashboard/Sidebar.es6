import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import Collapsible from 'in-components/Collapsible';
import WiringList from 'in-components/WiringList';

import SpringbootInfo from '../SpringbootInfo';

const SpringbootSidebar = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    const snapshot = this.props.snapshot;

    return (
      <div>
        <Collapsible initiallyOpen={true}>
          <Collapsible.Header>Spring Boot</Collapsible.Header>
          <Collapsible.Content>
            <SpringbootInfo snapshot={snapshot} />
          </Collapsible.Content>
        </Collapsible>
        <WiringList snapshot={snapshot} />
      </div>
    );
  }
});

export default SpringbootSidebar;
