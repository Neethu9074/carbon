import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import Collapsible from 'in-components/Collapsible';

import OracleDBInfo from '../OracleDBInfo';

const OracleDBSidebar = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    return (
      <div>
        <Collapsible initiallyOpen={true}>
          <Collapsible.Header>OracleDB</Collapsible.Header>
          <Collapsible.Content>
            <OracleDBInfo snapshot={this.props.snapshot} />
          </Collapsible.Content>
        </Collapsible>
      </div>
    );
  }
});

export default OracleDBSidebar;
