import PureRenderMixin from 'react-addons-pure-render-mixin';
import rpt from 'prop-types';
import React from 'react';

import {
  toggleContent,
  clearContent
} from 'in-components/DetailPopupPresenter/stores/DetailPopupPresenterContentStore';
import Button from 'in-components/Button';

import './KeyValuePopup.less';

export default React.createClass({
  displayName: 'KeyValuePopupButton',

  mixins: [PureRenderMixin],

  propTypes: {
    title: rpt.string.isRequired,
    data: rpt.object,
    children: rpt.any
  },

  componentWillUnmount() {
    clearContent();
  },

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
});
