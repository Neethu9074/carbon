import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import DeployedUnitList from 'in-components/DeployedUnitList';
import Collapsible from 'in-components/Collapsible';

import PhpFpmInfo from '../PhpFpmInfo';

const PhpFpmDashboardSidebar = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    return (
      <div>
        <Collapsible initiallyOpen={true}>
          <Collapsible.Header>PHP-FPM Runtime</Collapsible.Header>
          <Collapsible.Content>
            <PhpFpmInfo snapshot={this.props.snapshot} />
          </Collapsible.Content>
        </Collapsible>

        <DeployedUnitList snapshotId={this.props.snapshot.get('id')} />
      </div>
    );
  }

});

export default PhpFpmDashboardSidebar;
