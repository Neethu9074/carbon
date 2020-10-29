/* global require:false */
import rpt from 'prop-types';
import React from 'react';

import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter';
import { closeCurrentHelpIfOpen } from 'in-stores/navigation';
import Dialog from 'in-new-components/Dialog/Dialog';

import './HelpDialog.less';

const block = 'in-help-dialog';

class HelpDialog extends React.PureComponent {
  static propTypes = {
    id: rpt.oneOfType([rpt.string.isRequired, rpt.number.isRequired])
  };

  state = {
    article: null
  };

  UNSAFE_componentWillMount() {
    this.loadArticle();
  }

  loadArticle = () => {
    const id = this.props.id;

    // can happen when unmounting
    if (!id) {
      return;
    }

    // Note: Due to the way require(…) is transpiled arrow functions do not properly work here.
    // We therefore have to explicitly remember the value of 'this' :sadpanda:.
    const self = this;
    try {
      require(['./articles/' + id + '.mmd'], article => {
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
      content = (
        <Dialog title={this.state.article.meta.title} onClose={closeCurrentHelpIfOpen}>
          <DangerousHtmlPresenter className={`${block}__content`} html={this.state.article.html} />
        </Dialog>
      );
    } else if (this.state.error) {
      content = (
        <Dialog title="Help Article Missing" onClose={closeCurrentHelpIfOpen}>
          <p className={`${block}__content`}>Sorry, we failed to retrieve the help article :(.</p>
        </Dialog>
      );
    } else {
      content = (
        <Dialog title="Loading help text…" onClose={closeCurrentHelpIfOpen}>
          <LoadingIndicator />
        </Dialog>
      );
    }

    return content;
  }
}

export default HelpDialog;
