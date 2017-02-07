import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import {
  toggleContent,
  clearContent,
  content$
} from 'in-components/DetailPopupPresenter/stores/DetailPopupPresenterContentStore';
import Separator from 'in-sdk/components/sidebar/Separator';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import './KeyValuePopup.less';


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
      data: rpt.object
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

      const title = this.props.header;
      return (
        <div>
          <Separator />

          <div className={block}>
            <span className={block + '__header'}>
              {title}
            </span>
            <div className={buttonClassName}
                 onClick={() => toggleContent({title, data})}>
              <SvgIcon className={`${block}__icon`}
                       type='popup'
                       width={16}
                       color='#4a91e4' />
            </div>
          </div>
        </div>
      );
    }
  })
);
