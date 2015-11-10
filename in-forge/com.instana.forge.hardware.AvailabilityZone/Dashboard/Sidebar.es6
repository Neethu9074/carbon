import irpt from 'react-immutable-proptypes';
import React from 'react/addons';


const AvailabilityZoneSidebar = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    return (
      <div>
      </div>
    );
  }
});

export default AvailabilityZoneSidebar;
