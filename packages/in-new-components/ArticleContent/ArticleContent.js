/* global require:false */
import rpt from 'prop-types';
import React from 'react';

import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter';
import LoadingIndicator from 'in-components/LoadingIndicator';

import locals from './ArticleContent.mless';

export default class ArticleContent extends React.PureComponent {
  static propTypes = {
    id: rpt.string.isRequired
  };

  state = {
    article: null
  };

  componentDidMount() {
    this.loadArticle();
  }

  loadArticle = () => {
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
  };

  componentDidUpdate(prevProps) {
    if (prevProps.id !== this.props.id) {
      this.loadArticle();
    }
  }

  render() {
    let content;
    if (this.state.article) {
      content = <DangerousHtmlPresenter className={locals.content} html={this.state.article.html} />;
    } else if (this.state.error) {
      content = <p className={locals.content}>Sorry, we failed to retrieve the help article :(.</p>;
    } else {
      content = <LoadingIndicator />;
    }

    return content;
  }
}
