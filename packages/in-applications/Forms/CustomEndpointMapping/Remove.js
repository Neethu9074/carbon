/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect, useState } from 'react';
import { get } from 'lodash';

import { Spacer, Button } from '@instana/components';

import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { serviceDashboard } from 'in-applications/navigation/paths';
import { deleteEndpointConfig } from 'in-api/endpointConfiguration';
import DescriptionText from 'in-components/form/DescriptionText';
import { combineDataAndError } from 'in-services/util/ro';
import SaveError from 'in-components/form/SaveError';
import { t } from 'in-i18n';

import locals from './Remove.mless';

export default function Remove({ config }) {
  const { goToPath } = useNavigation();
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [removeError, setRemoveError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [subscription, setSubscription] = useState();

  useEffect(
    () => () => {
      subscription?.dispose();
    },
    [subscription]
  );

  if (!config) {
    return null;
  }

  function onTickChange(e) {
    setCheckboxChecked(e.target.checked);
  }

  function remove(e) {
    e.preventDefault();

    setLoading(true);
    setRemoveError(null);

    setSubscription(previousSubscription => {
      previousSubscription?.dispose();
      return combineDataAndError(deleteEndpointConfig(config.serviceId)).once(({ error }) => {
        if (error) {
          setLoading(false);
          setRemoveError(get(error, ['response', 'body', 'errors', 0]) || String(error));
        } else {
          goToPath(`${serviceDashboard}/endpoints`);
        }
      });
    });
  }

  return (
    <>
      <Spacer vertical="normal" />
      <DescriptionText>{t('in-applications:forms.descriptionResetToDefaultRule')}</DescriptionText>
      <input type="checkbox" checked={checkboxChecked} onChange={onTickChange} disabled={loading} />
      {t('in-applications:forms.understandCheckboxResetToDefaultRule')}
      {removeError && <SaveError>{removeError}</SaveError>}
      <Button kind="danger" disabled={loading || !checkboxChecked} onClick={remove} className={locals.removeButton}>
        {t('in-applications:buttonResetToDefault')}
      </Button>
    </>
  );
}
