import React from 'react/addons';
import irpt from 'react-immutable-proptypes';

import List from 'in-components/List';

const AppPoolList = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    const pools = this.props.snapshot.getIn(['data', 'allpools']);
    if (!pools || pools.length === 0) {
      return null;
    }

    return (
      <List>
        {pools.map((pool, i) =>
          <List.Item key={i}>
            {pool}
          </List.Item>
        ).toArray()}
      </List>
    );
  }
});

export default AppPoolList;
