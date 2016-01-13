import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import getForgeComponent from 'in-services/getForgeComponent';
import Collapsible from 'in-components/Collapsible';
import {getHostHardware} from 'in-services/wiring';
import enhance from 'in-components/hoc/enhance';
import {getSingular} from 'in-sdk/pluginName';

const HostHardware = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    group: irpt.map
  },

  statics: {
    createObservables(props) {
      return {
        group: getHostHardware(props.snapshot)
      };
    }
  },

  render() {
    const snapshot = this.props.group;
    if (!snapshot) return null;

    const Details = this.getForgeSpecificComponent();

    return (
      <Collapsible initiallyOpen={true}>
        <Collapsible.Header>
          {getSingular(snapshot.get('pluginId'))}
        </Collapsible.Header>
        <Collapsible.Content>
          <Details snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>
    );
  },

  getForgeSpecificComponent() {
    const snapshot = this.props.group;
    return getForgeComponent(
      './' +
      snapshot.get('pluginId') +
      '/Sidebar/Details.es6'
    );
  }
});

export default enhance(HostHardware);
