import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';
import irpt from 'react-immutable-proptypes';

export default React.createClass({
    displayName: 'Ec2Dashboard',

    mixins: [PureRenderMixin],

    propTypes: {
      snapshot: irpt.map.isRequired
    },

    render() {
      return (
        <div/>
      );
    }
});
