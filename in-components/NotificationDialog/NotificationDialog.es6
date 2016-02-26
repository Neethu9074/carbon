import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import Button from '../Button';
import Dialog from '../Dialog';
import Icon from '../Icon';

import './NotificationDialog.less';

const rpt = React.PropTypes;
const block = 'in-notification-dialog';

const NotificationDialog = React.createClass({
  mixins: [PureRenderMixin],

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

        <h1 className={block + '__header'}>{this.props.title}</h1>

        {this.props.children}

        {closeButtonVisible === undefined || closeButtonVisible ?
          <Button className={block + '__button-close'}
                  onClick={this.props.onClose}>
            <Icon type={'delete'} className={block + '__button-close__icon'}/>
          </Button>
        : null}
      </Dialog>
    );
  }
});

export default NotificationDialog;
