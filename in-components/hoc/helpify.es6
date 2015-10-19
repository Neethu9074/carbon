import React from 'react/addons';
import {Navigation, State} from 'react-router';

export default function helpify(Component) {
  return React.createClass({
    displayName: 'Helpify',

    mixins: [Navigation, State],

    render() {
      return (
        <Component {...this.props}
                   showHelp={this.showHelp}
                   closeHelpIfOpen={this.closeHelpIfOpen} />
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
    },

    closeHelpIfOpen(id) {
      const query = this.getQuery();
      if (query.help === id) {
        delete query.help;
        this.transitionTo(
          this.getPathname(),
          this.getParams(),
          query
        );
      }
    }
  });
}
