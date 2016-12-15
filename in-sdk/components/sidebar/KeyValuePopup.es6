import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import {
  toggleContent,
  clearContent,
  content$
} from 'in-components/DetailPopupPresenter/stores/DetailPopupPresenterContentStore';
import Separator from 'in-sdk/components/sidebar/Separator';
import connectTo from 'in-hoc/connectTo';
import Icon from 'in-components/Icon';

import './KeyValuePopup.less';


const MAX_LABEL_LENGTH = 33;
const block = 'in-key-value-popup';
const rpt = React.PropTypes;

export default connectTo({
    activeContent: content$
  },
  React.createClass({

    displayName: 'KeyValuePopup',

    mixins: [
      PureRenderMixin
    ],

    propTypes: {
      header: rpt.string.isRequired,
      activeContent: rpt.object,
      addSeparator: rpt.bool,
      data: rpt.object
    },

    getDefaultProps() {
      return {
        addSeparator: true
      };
    },

    componentWillUnmount() {
      clearContent();
    },

    render() {
      const data = this.props.data;
      if (data == null || data.size === 0) {
        return null;
      }

      const activeContent = this.props.activeContent;
      const buttonClassName = activeContent && data === activeContent.data ?
        block + '__button-open' :
        block + '__button-close';

      let title = this.props.header;
      const header = title.length > MAX_LABEL_LENGTH
        ? `${title.substring(0, MAX_LABEL_LENGTH)}...`
        : title;

      return (
        <div>
          {this.props.addSeparator ? <Separator /> : null}

          <div className={block}>
            <span className={block + '__header'}>
              {header}
            </span>
            <div className={buttonClassName}
                 onClick={() => toggleContent({title, data})}>
              <Icon type='popup_pop_up' />
            </div>
          </div>
        </div>
      );
    }
  })
);
