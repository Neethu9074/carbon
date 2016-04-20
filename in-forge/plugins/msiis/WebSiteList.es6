import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import List from 'in-components/List';


export default React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    const sites = this.props.snapshot.getIn(['data', 'allsites']);
    return (
      (!sites || sites.size === 0) ?
      null :
      <List>
        {sites.map(site =>
          <List.Item key={site}>
            {site}
          </List.Item>
        )}
      </List>
    );
  }
});
