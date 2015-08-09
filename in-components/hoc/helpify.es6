

import React from 'react/addons';
import {Navigation, State} from 'react-router';

export default function helpify(Component) {
  return React.createClass({
    displayName: 'Helpify',

    mixins: [Navigation, State],

    render() {
      return (
        <Component {...this.props}
                   showHelp={this.showHelp} />
      );
    },

    showHelp(id) {
      const query = this.getQuery();
      query.help = id;
      this.transitionTo(
        this.getPathname(),
        this.getParams(),
        query
      );
    }
  });
}
