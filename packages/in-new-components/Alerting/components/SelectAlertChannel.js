import PropTypes from 'prop-types';
import React from 'react';

import SelectAlertChannelPresenter, {
  SelectListDialogContent
} from 'in-new-components/Alerting/components/SelectAlertChannelPresenter';
import Button from 'in-new-components/Button/Button';

export default function SelectAlertChannel(props) {
  const { form, onChange, setAlertChannelsVisible } = props;

  return (
    <SelectAlertChannelPresenter
      rightHeader={
        <Button
          kind="action"
          onClick={() =>
            setAlertChannelsVisible({
              slideInConfig: {
                component: (
                  <SelectListDialogContent
                    form={form}
                    onSubmit={selectedIds => {
                      onChange(['alertChannelIds'], field => field.setValue(selectedIds).setTouched(true));
                      setAlertChannelsVisible({ isVisible: false });
                    }}
                  />
                ),
                title: 'Select alert channels'
              },
              isVisible: true
            })
          }
          icon="lib_openclose_add_circle_outline"
        >
          Select Alert Channels
        </Button>
      }
      {...props}
    />
  );
}

SelectAlertChannel.propTypes = {
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  setAlertChannelsVisible: PropTypes.func.isRequired
};
