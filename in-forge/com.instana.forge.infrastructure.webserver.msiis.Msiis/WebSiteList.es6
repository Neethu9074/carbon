import React from 'react/addons';
import irpt from 'react-immutable-proptypes';

import List from 'in-components/List';

const WebSiteList = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    const sites = this.props.snapshot.getIn(['data', 'allsites']).toArray();
    if (!sites || sites.length === 0) {
      return null;
    }

    return (
      <List>
        {sites.map((site, i) =>
          <List.Item key={i}>
            {site}
          </List.Item>
        )}
      </List>
    );
  }
});

export default WebSiteList;
