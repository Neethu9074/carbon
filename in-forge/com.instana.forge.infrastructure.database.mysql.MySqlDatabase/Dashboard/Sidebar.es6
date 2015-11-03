import React from 'react/addons';
import irpt from 'react-immutable-proptypes';

import Collapsible from 'in-components/Collapsible';
import WiringList from 'in-components/WiringList';

import MySqlInfo from '../MySqlInfo';

const MySqlSidebar = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    return (
      <div>
        <Collapsible initiallyOpen={true}>
          <Collapsible.Header>MySql</Collapsible.Header>
          <Collapsible.Content>
            <MySqlInfo snapshot={this.props.snapshot} />
          </Collapsible.Content>
        </Collapsible>
        <WiringList snapshot={this.props.snapshot} />
      </div>
    );
  }

});

export default MySqlSidebar;
