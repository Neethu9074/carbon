import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import Collapsible from 'in-components/Collapsible';

import IISInfo from '../IISInfo';

const MsIISSidebar = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {

    const snapshot = this.props.snapshot;

    return (
      <div>
        <Collapsible initiallyOpen={true}>
          <Collapsible.Header>Internet Information Server</Collapsible.Header>
          <Collapsible.Content>
            <IISInfo snapshot={snapshot} />
          </Collapsible.Content>
        </Collapsible>
      </div>
    );
  }
});

export default MsIISSidebar;
