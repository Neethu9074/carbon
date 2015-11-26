import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import Collapsible from 'in-components/Collapsible';
import WiringList from 'in-components/WiringList';

import NginxInfo from '../NginxInfo';

const NginxSidebar = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    return (
      <div>
        <Collapsible initiallyOpen={true}>
          <Collapsible.Header>Nginx</Collapsible.Header>
          <Collapsible.Content>
            <NginxInfo snapshot={this.props.snapshot} />
          </Collapsible.Content>
        </Collapsible>
        <WiringList snapshot={this.props.snapshot} />
      </div>
    );
  }
});

export default NginxSidebar;
