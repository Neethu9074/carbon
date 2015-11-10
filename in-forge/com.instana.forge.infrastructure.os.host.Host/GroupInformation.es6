import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import getForgeComponent from 'in-services/getForgeComponent';
import Collapsible from 'in-components/Collapsible';
import enhance from 'in-components/hoc/enhance';
import {getStructure} from 'in-services/wiring';
import {getSingular} from 'in-sdk/pluginName';
import * as views from 'in-services/views';

const GroupInformation = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    group: irpt.map
  },

  statics: {
    createObservables(props) {
      const snapshotId = props.snapshot.get('id');

      return {
        group: getStructure(views.physical, true)
          .map(viewStructure => {
            return viewStructure
              .filter(nodeStructure => nodeStructure.node.get('id') === snapshotId)
              .reduce((group, nodeStructure) => group || nodeStructure.group, null);
          })
      };
    }
  },

  render() {
    const group = this.props.group;
    if (!group) return null;

    const Details = this.getForgeSpecificComponent();

    return (
      <Collapsible initiallyOpen={true}>
        <Collapsible.Header>
          {getSingular(group.get('pluginId'))}
        </Collapsible.Header>
        <Collapsible.Content>
          <Details snapshot={group} />
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

export default enhance(GroupInformation);
