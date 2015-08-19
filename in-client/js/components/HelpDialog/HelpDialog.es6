

import React from 'react/addons';
import {Navigation, State} from 'react-router';
import {createLogger} from 'instalog';

import http from 'in-services/http';
import LoadingIndicator from 'in-components/LoadingIndicator';
import NotificationDialog from 'in-components/NotificationDialog';

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
        <NotificationDialog title={this.state.article.title}
                            onClose={this.onClose}>
          <div dangerouslySetInnerHTML={{__html: this.state.article.body}}></div>
        </NotificationDialog>
      );
    } else if (this.state.error) {
      content = (
        <NotificationDialog title='Failed to load help text'
                            onClose={this.onClose}>
          <p>Failed to retrieve the given help article, sorry :(.</p>
        </NotificationDialog>
      );
    } else {
      content = (
        <NotificationDialog title='Loading help text...'
                            onClose={this.onClose}>
          <LoadingIndicator />
        </NotificationDialog>
      );
    }

    return content;
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
