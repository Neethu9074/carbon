'use strict';

import React from 'react/addons';
import {Navigation, State} from 'react-router';
import {createLogger} from 'instalog';

import http from 'in-services/http';
import LoadingIndicator from 'in-components/LoadingIndicator';
import Dialog from 'in-components/Dialog';

const logger = createLogger('in-client.HelpDialog');

const rpt = React.PropTypes;

const HelpDialog = React.createClass({
  mixins: [React.addons.PureRenderMixin, Navigation, State],

  propTypes: {
    id: rpt.string.isRequired
  },

  getInitialState() {
    return {
      article: null
    };
  },

  componentWillMount() {
    this.loadArticle();
  },

  loadArticle() {
    const id = this.props.id;
    const url = 'https://instana.zendesk.com//api/v2/help_center/articles/' +
      id + '.json';
    http({method: 'GET', url})
    .then(response => {
      this.setState({
        article: response.body.article,
        error: null
      });
    }, err => {
      logger.error('Failed to retrieve article with id', id, 'from ZenDesk', err);
      this.setState({
        article: null,
        error: err
      });
    });
  },

  componentDidUpdate(prevProps) {
    if (prevProps.id !== this.props.id) {
      this.loadArticle();
    }
  },

  render() {
    let content;
    if (this.state.article) {
      content = (
        <div>
          <h1>{this.state.article.title}</h1>
          <div dangerouslySetInnerHTML={{__html: this.state.article.body}}></div>
        </div>
      );
    } else if (this.state.error) {
      content = <p>Failed to retrieve the given help article, sorry :(.</p>;
    } else {
      content = <LoadingIndicator />;
    }

    return (
      <Dialog onClose={this.onClose}>
        {content}
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
