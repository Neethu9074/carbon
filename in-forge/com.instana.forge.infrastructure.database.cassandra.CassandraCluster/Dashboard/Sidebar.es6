import irpt from 'react-immutable-proptypes';
import React from 'react/addons';


const CassandraClusterSidebar = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    return (
      <div/>
    );
  }
});

export default CassandraClusterSidebar;
