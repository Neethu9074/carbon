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
  const buttons = [
    <AlertChannelButton type="email" {...props} />,
    <AlertChannelButton type="slack" {...props} />,
    <AlertChannelButton type="opsgenie" {...props} />,
    <AlertChannelButton type="pagerduty" {...props} />,
    <AlertChannelButton type="office365" {...props} />,
    <AlertChannelButton type="webhook" {...props} />,
    <AlertChannelButton type="splunk" {...props} />,
    <AlertChannelButton type="googleChat" {...props} />,
    <AlertChannelButton type="victorOps" {...props} />,
    <AlertChannelButton type="prometheusWebhook" {...props} />,
    <AlertChannelButton type="webexTeamsWebhook" {...props} />,
    <AlertChannelButton type="watsonAIOpsWebhook" {...props} />
  ];

  return (
    <MultiButton
      className={locals.createNewButton}
      kind="action"
      icon="lib_openclose_add_circle_outline"
      label={t('in-settings:tabs.addAlertChannel')}
      buttons={buttons}
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
