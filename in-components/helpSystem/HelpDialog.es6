/* global require:false */

import PureRenderMixin from 'react-addons-pure-render-mixin';
import rpt from 'prop-types';
import React from 'react';

import NotificationDialog from 'in-components/NotificationDialog';
import LoadingIndicator from 'in-components/LoadingIndicator';
import { closeHelp } from 'in-stores/navigation';

import './HelpDialog.less';

const block = 'in-help-dialog';

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

    const self = this;
    try {
      require(['./articles/' + id + '.mmd'], function onModLoad(article) {
        try {
          self.setState({
            article: article,
            error: null
          });
        } catch (e) {
          self.setState({
            article: null,
            error: e
          });
        }
      });
    } catch (e) {
      self.setState({
        article: null,
        error: e
      });
    }
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
        <NotificationDialog title={this.state.article.meta.title} onClose={closeHelp}>
          <div dangerouslySetInnerHTML={{ __html: this.state.article.html }} className={`${block}__content`} />
        </NotificationDialog>
      );
    } else if (this.state.error) {
      content = (
        <NotificationDialog title="Help Article Missing" onClose={closeHelp}>
          <p className={`${block}__content`}>
            Sorry, we failed to retrieve the help article :(.
          </p>
        </NotificationDialog>
      );
    } else {
      content = (
        <NotificationDialog title="Loading help text…" onClose={closeHelp}>
          <LoadingIndicator />
        </NotificationDialog>
      );
    }

    return content;
  }
});

export default HelpDialog;
