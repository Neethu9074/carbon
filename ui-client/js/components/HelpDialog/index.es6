'use strict';

import React from 'react/addons';
import {Navigation, State} from 'react-router';

import Dialog from '../Dialog';

const rpt = React.PropTypes;

const HelpDialog = React.createClass({
  mixins: [React.addons.PureRenderMixin, Navigation, State],

  propTypes: {
    id: rpt.string.isRequired
  },

  render() {
    return (
      <Dialog onClose={this.onClose}>
        {this.props.id}
      </Dialog>
    );
  },

  onClose() {
    const query = this.getQuery();
    delete query.help;
    this.transitionTo(
      this.getPathname(),
      this.getParams(),
      query
    );
  }
});

export default HelpDialog;
