import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';
import irpt from 'react-immutable-proptypes';

import List from 'in-components/List';

const AppPoolList = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    const pools = this.props.snapshot.getIn(['data', 'allpools']).toArray();
    if (!pools || pools.length === 0) {
      return null;
    }

    return (
      <List>
        {pools.map((pool, i) =>
          <List.Item key={i}>
            {pool}
          </List.Item>
        )}
      </List>
    );
  }
});

export default AppPoolList;
