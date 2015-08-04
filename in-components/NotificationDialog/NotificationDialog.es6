'use strict';

import React from 'react/addons';

import Button from '../Button';
import Dialog from '../Dialog';

import infoPath from './info.svg';

import './NotificationDialog.less';

const rpt = React.PropTypes;
const block = 'in-notification-dialog';

const NotificationDialog = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    title: rpt.string.isRequired,
    children: rpt.any.isRequired,
    onClose: rpt.func,
    closeButtonVisible: rpt.bool
  },

  render() {
    const closeButtonVisible = this.props.closeButtonVisible;

    return (
      <Dialog className={block}
              onClose={this.props.onClose}>
        <h2 className={block + '__type'}>
          <img src={infoPath}
               alt='Information Indicator'
               className={block + '__info-icon'} />
          Information
        </h2>

        <h1 className={block + '__header'}>{this.props.title}</h1>

        {this.props.children}

        {closeButtonVisible === undefined || closeButtonVisible ?
          <Button type='button'
                  onClick={this.props.onClose}>
            Okay, got it
          </Button>
        : null}
      </Dialog>
    );
  }
});

export default NotificationDialog;
