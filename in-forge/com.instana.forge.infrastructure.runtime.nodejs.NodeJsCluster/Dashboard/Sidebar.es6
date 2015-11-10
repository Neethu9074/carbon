import React from 'react/addons';
import irpt from 'react-immutable-proptypes';

export default React.createClass({
  displayName: 'NodejsClusterSidebar',

  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    return <div/>;
  }

});
