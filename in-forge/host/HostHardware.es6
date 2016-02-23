import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import getForgeComponent from 'in-services/getForgeComponent';
import Collapsible from 'in-components/Collapsible';
import getFoundation from 'in-hoc/getFoundation';
import {getSingular} from 'in-sdk/pluginName';

export default getFoundation(React.createClass({
  displayName: 'HostHardware',

  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    foundationSnapshot: irpt.map
  },

  render() {
    const snapshot = this.props.foundationSnapshot;
    if (!snapshot) return null;

    const Details = this.getForgeSpecificComponent();

    return (
      <Collapsible initiallyOpen={true}>
        <Collapsible.Header>
          {getSingular(snapshot.get('plugin'))}
        </Collapsible.Header>
        <Collapsible.Content>
          <Details snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>
    );
  },

  getForgeSpecificComponent() {
    const snapshot = this.props.foundationSnapshot;
    return getForgeComponent(
      './' +
      snapshot.get('plugin') +
      '/Sidebar/Details.es6'
    );
  }
}));
