import PureRenderMixin from 'react-addons-pure-render-mixin';
import {createLogger} from 'instalog';
import React from 'react';

import NotificationDialog from 'in-components/NotificationDialog';
import LoadingIndicator from 'in-components/LoadingIndicator';
import {closeHelp} from 'in-stores/navigation';
import http from 'in-services/http';

import './HelpDialog.less';

const logger = createLogger('in-client.HelpDialog');

const block = 'in-help-dialog';

const rpt = React.PropTypes;
const HelpDialog = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    id: rpt.oneOfType([rpt.string.isRequired, rpt.number.isRequired])
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

    // can happen when unmounting
    if (!id) {
      return;
    }

    const url = 'https://instana.zendesk.com/api/v2/help_center/articles/' +
      id + '.json';
    http({method: 'GET', url})
      .once(response => {
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
                            onClose={closeHelp}>
          <div dangerouslySetInnerHTML={{__html: this.state.article.body}}
                className={`${block}__content`} />
        </NotificationDialog>
      );
    } else if (this.state.error) {
      content = (
        <NotificationDialog title='Sorry, we failed to retrieve the given help article :('
                            onClose={closeHelp}>
          <p className={`${block}__content`}>
            You can still access the article, though a bit less convenient, via our&nbsp;
            <a href={'https://instana.zendesk.com/hc/en-us/articles/' + this.props.id}
               target='_blank'>
              help system
            </a>.
          </p>
        </NotificationDialog>
      );
    } else {
      content = (
        <NotificationDialog title='Loading help text…'
                            onClose={closeHelp}>
          <LoadingIndicator />
        </NotificationDialog>
      );
    }

    return content;
  }
});

export default HelpDialog;
