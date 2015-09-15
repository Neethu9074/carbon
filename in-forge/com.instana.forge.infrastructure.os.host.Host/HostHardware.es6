import React from 'react/addons';
import irpt from 'react-immutable-proptypes';

import enhance from 'in-components/hoc/enhance';
import Collapsible from 'in-components/Collapsible';
import * as views from 'in-services/views';
import {getStructure} from 'in-services/wiring';
import getForgeComponent from 'in-services/getForgeComponent';
import {getSingular} from 'in-sdk/pluginName';

const HostHardware = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    group: irpt.map
  },

  statics: {
    createObservables(props) {
      const snapshotId = props.snapshot.get('id');

      return {
        group: getStructure(views.physical.hosts, true)
          .map(viewStructure => {
            return viewStructure
              .filter(nodeStructure => nodeStructure.node.get('id') === snapshotId)
              .reduce((group, nodeStructure) => group || nodeStructure.group, null);
          })
      };
    }
  },

  render() {
    if (!this.props.group) return null;

    const Details = this.getForgeSpecificComponent();

    return (
      <Collapsible initiallyOpen={true}>
        <Collapsible.Header>
          {getSingular(this.props.group.get('pluginId'))}
        </Collapsible.Header>
        <Collapsible.Content>
          <Details snapshot={this.props.group} />
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
