/*global require:false*/

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

  getInitialState() {
    return {
      content: null
    };
  },

  componentDidMount() {
    this.loadContent();
  },

  loadContent() {
    // this needs to be assigned to a variable as the following require
    // statement will be changed significantly by webpack.
    //
    // TODO Handle errors where the required file would not exist
    const id = this.props.id;
    require(
      ['../../../help/' + id + '.md'],
      content => this.setState({content})
    );
  },

  componentDidUpdate() {
    this.loadContent();
  },

  render() {
    if (!this.state.content) {
      // TODO Show Loading animation
      return null;
    }

    const html = {__html: this.state.content};
    return (
      <Dialog onClose={this.onClose}>
        <div dangerouslySetInnerHTML={html} />
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
