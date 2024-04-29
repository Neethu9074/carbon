/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { zeroDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: [
      'connect_success',
      'connect_account_throttle',
      'connect_client_id_throttle',
      'connect_throttle_total',
      'ping_success',
      'connect_auth_error',
      'connect_client_error',
      'connect_server_error',
      'publish_in_auth_error',
      'publish_in_client_error',
      'publish_in_server_error',
      'publish_in_success',
      'publish_in_throttle',
      'publish_out_auth_error',
      'publish_out_client_error',
      'publish_out_success',
      'publish_out_throttle',
      'subscribe_success',
      'subscribe_throttle'
    ],
    labels: [
      t('in-forge:plugins.awsIotCore.labelConnectSuccess'),
      t('in-forge:plugins.awsIotCore.labelConnectAccountThrottle'),
      t('in-forge:plugins.awsIotCore.labelConnectClientIdThrottle'),
      t('in-forge:plugins.awsIotCore.labelConnectThrottleTotal'),
      t('in-forge:plugins.awsIotCore.labelPingSuccess'),
      t('in-forge:plugins.awsIotCore.labelConnectAuthError'),
      t('in-forge:plugins.awsIotCore.labelConnectClientError'),
      t('in-forge:plugins.awsIotCore.labelConnectServerError'),
      t('in-forge:plugins.awsIotCore.labelPublishInAuthError'),
      t('in-forge:plugins.awsIotCore.labelPublishInClientError'),
      t('in-forge:plugins.awsIotCore.labelPublishInServerError'),
      t('in-forge:plugins.awsIotCore.labelPublishInSuccess'),
      t('in-forge:plugins.awsIotCore.labelPublishInThrottle'),
      t('in-forge:plugins.awsIotCore.labelPublishOutAuthError'),
      t('in-forge:plugins.awsIotCore.labelPublishOutClientError'),
      t('in-forge:plugins.awsIotCore.labelPublishOutSuccess'),
      t('in-forge:plugins.awsIotCore.labelPublishOutThrottle'),
      t('in-forge:plugins.awsIotCore.labelSubscribeSuccess'),
      t('in-forge:plugins.awsIotCore.labelSubscribeThrottle')
    ],
    category: [t('in-forge:plugins.awsIotCore.category.messageBroker')],
    formatter: zeroDecimalPlaces,
    min: 0
  },
  {
    metrics: ['rules_executed'],
    labels: [t('in-forge:plugins.awsIotCore.labelRulesExecuted')],
    category: [t('in-forge:plugins.awsIotCore.category.rules')],
    formatter: zeroDecimalPlaces,
    min: 0
  },
  {
    metrics: [
      'get_thing_shadow_accepted',
      'update_thing_shadow_accepted',
      'delete_thing_shadow_accepted',
      'list_thing_shadow_accepted'
    ],
    labels: [
      t('in-forge:plugins.awsIotCore.labelGetThingShadowAccepted'),
      t('in-forge:plugins.awsIotCore.labelUpdateThingShadowAccepted'),
      t('in-forge:plugins.awsIotCore.labelDeleteThingShadowAccepted'),
      t('in-forge:plugins.awsIotCore.labelListThingShadowAccepted')
    ],
    category: [t('in-forge:plugins.awsIotCore.category.deviceShadow')],
    formatter: zeroDecimalPlaces,
    min: 0
  }
];
