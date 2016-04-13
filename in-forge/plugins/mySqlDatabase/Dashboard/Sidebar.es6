import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import Collapsible from 'in-components/Collapsible';
import DeployedUnitList from 'in-components/DeployedUnitList';

import MySqlInfo from '../MySqlInfo';

const MySqlSidebar = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    const snapshot = this.props.snapshot;

    return (
      <div>
        <Collapsible initiallyOpen={true}>
          <Collapsible.Header>MySql</Collapsible.Header>
          <Collapsible.Content>
            <MySqlInfo snapshot={snapshot} />
          </Collapsible.Content>
        </Collapsible>
        <DeployedUnitList snapshotId={snapshot.get('id')} />
      </div>
    );
  }
});

export default MySqlSidebar;
