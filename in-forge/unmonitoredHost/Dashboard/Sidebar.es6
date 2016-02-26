import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

export default React.createClass({
  displayName: 'UnmonitoredHostSidebar',

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
