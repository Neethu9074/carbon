import React from 'react/addons';
import irpt from 'react-immutable-proptypes';

const GenericJavaWebAppDashboardSidebar = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    return (
      <div></div>
    );
  }

});

export default GenericJavaWebAppDashboardSidebar;
