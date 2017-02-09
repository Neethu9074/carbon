import irpt from 'react-immutable-proptypes';
import React from 'react';

import {removeAlert} from 'in-services/groundskeeper/alertings';
import {close} from 'in-components/DialogPresenter/store';
import Button from 'in-components/Button';
import Dialog from 'in-components/Dialog';
import connectTo from 'in-hoc/connectTo';

import 'in-views/configurationView/subview/Alerts/RemoveAlertDialog.less';


const block = 'in-alters-remove-dialog';

export default connectTo({
},
React.createClass({

  displayName: 'RemoveAlertDialog',

  propTypes: {
    alert: irpt.map.isRequired
  },

  getInitialState() {
    return {
    };
  },

  render() {
    return (
      <Dialog header={`Remove Alert (${this.props.alert.get('id')})`}
              onClose={close}>
        <div className={block}>
          <p>
            Are you sure you want to remove this alert?
          </p>
          <Button kind='danger'
                  onClick={this.onRemoveClick}>
            Remove
          </Button>
          <Button className={`${block}__cancel-button`}
                  kind='secondary'
                  onClick={this.onCancelClick}>
            Cancel
          </Button>
        </div>
      </Dialog>
    );
  },

  onRemoveClick(e) {
    e.preventDefault();

    removeAlert(this.props.alert.get('id'));
    close();
  },

  onCancelClick() {
    close();
  }
}));
