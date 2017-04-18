import rpt from 'prop-types';
import React from 'react';

import {
  toggleContent,
  clearContent
} from 'in-components/DetailPopupPresenter/stores/DetailPopupPresenterContentStore';
import Button from 'in-components/Button';

import './KeyValuePopup.less';

export default class extends React.PureComponent {
  static displayName = 'KeyValuePopupButton';

  static propTypes = {
    title: rpt.string.isRequired,
    data: rpt.object,
    children: rpt.any
  };

  componentWillUnmount() {
    clearContent();
  }

  render() {
    const data = this.props.data;
    if (data == null || data.size === 0) {
      return null;
    }

    return (
      <Button onClick={() => toggleContent({ title: this.props.title, data })} size="sm" kind="secondary">
        {this.props.children}
      </Button>
    );
  }
}
