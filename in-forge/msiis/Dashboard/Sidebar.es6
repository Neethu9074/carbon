import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import Collapsible from 'in-components/Collapsible';

import IISInfo from '../IISInfo';
import AppPoolList from '../AppPoolList.es6';
import WebSiteList from '../WebSiteList.es6';

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
        <Collapsible initiallyOpen={false}>
          <Collapsible.Header>Web-Sites</Collapsible.Header>
          <Collapsible.Content>
            <WebSiteList snapshot={snapshot} />
          </Collapsible.Content>
        </Collapsible>
        <Collapsible initiallyOpen={false}>
          <Collapsible.Header>Application-Pools</Collapsible.Header>
          <Collapsible.Content>
            <AppPoolList snapshot={snapshot} />
          </Collapsible.Content>
        </Collapsible>
      </div>
    );
  }
});

export default MsIISSidebar;
