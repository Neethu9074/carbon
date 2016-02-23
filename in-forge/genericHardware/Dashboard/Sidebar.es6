import irpt from 'react-immutable-proptypes';
import React from 'react/addons';


const GenericHardwareSidebar = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    return (
      null
    );
  }
});

export default GenericHardwareSidebar;
