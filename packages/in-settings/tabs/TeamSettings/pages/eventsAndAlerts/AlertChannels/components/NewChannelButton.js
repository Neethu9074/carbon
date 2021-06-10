/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { Button } from '@instana/components';

import configs from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/AlertChannels/configs';
import { goToAlertChannelView } from 'in-settings/navigation/paths';
import MultiButton from 'in-new-components/MultiButton';
import { t } from 'in-i18n';

import locals from './NewChannelButton.mless';

export default function NewChannelButton(props) {
  return (
    <MultiButton
      className={locals.createNewButton}
      kind="action"
      icon="lib_openclose_add_circle_outline"
      label={t('in-settings:tabs.addAlertChannel')}
      buttons={Object.keys(configs).map(kind => (
        <AlertChannelButton type={kind} {...props} />
      ))}
    />
  );
}

function AlertChannelButton({ type, className }) {
  return (
    <Button
      className={classNames({
        [locals.alertChannelButton]: true,
        [className]: className
      })}
      kind="secondary"
      onClick={() => goToAlertChannelView(type)}
    >
      {configs[type].label}
    </Button>
  );
}
