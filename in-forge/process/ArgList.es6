import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import List from 'in-components/List';

const ArgList = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    const args = this.props.snapshot.getIn(['data', 'args']);
    if (!args || args.size === 0) {
      return null;
    }

    return (
      <List>
        {args.map((arg, i) =>
          <List.Item key={i}>
            {arg}
          </List.Item>
        ).toArray()}
      </List>
    );
  }
});

export default ArgList;
