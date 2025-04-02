/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState, useEffect } from 'react';
import { get } from 'lodash';

import {
  Card,
  CarbonButton as Button,
  Typography,
  CarbonStack as Stack,
  Checkbox,
  Message,
  CarbonForm as Form
} from '@instana/components';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import { RenderIcon } from 'in-applications/analyze/components/SaveFilters/RenderIcon';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { deleteApplicationConfig } from 'in-api/applicationConfigs';
import { applicationsList } from 'in-applications/navigation/paths';
import { combineDataAndError } from 'in-services/util/ro';
import { Trans, t } from 'in-i18n';

import locals from './Remove.mless';

export default function RemoveSection({ application }) {
  const { goToPath } = useNavigation();
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    return () => {
      if (subscription) {
        subscription.dispose();
      }
    };
  });

  if (!application) {
    return null;
  }

  return (
    <MaxWidthFullscreenContainer className={locals.maxWidthFullscreenContainer}>
      <Card title={t('in-applications:titleRemoveApplicationPerspective')}>
        <Form onSubmit={e => remove(e)} aria-label="application-deletion-form">
          <Stack gap={4}>
            <Typography variant="label-01">
              <Trans
                i18nKey="in-applications:forms.newApplication.descriptionRemoveApplicationPerspective"
                values={{ application: application.label }}
              />
            </Typography>
            <Checkbox
              label={t('in-applications:forms.understandCheckboxResetToDefaultRule')}
              checked={checkboxChecked}
              onChange={onTickChange}
              disabled={loading}
            />
            {error && <Message type="error">{error}</Message>}
            <div className={locals.footer}>
              <Button
                kind="danger"
                type="submit"
                disabled={loading || !checkboxChecked}
                renderIcon={() => <RenderIcon type="lib_actions_delete" size="xs" />}
              >
                {t('in-applications:buttonRemoveApplicationPerspective')}
              </Button>
            </div>
          </Stack>
        </Form>
      </Card>
    </MaxWidthFullscreenContainer>
  );

  function onTickChange(e) {
    setCheckboxChecked(e.target.checked);
  }

  function remove(e) {
    e.preventDefault();

    setLoading(true);
    setError(null);

    setSubscription(
      combineDataAndError(deleteApplicationConfig(application.id)).once(({ error }) => {
        if (error) {
          setLoading(false);
          setError(get(error, ['response', 'body', 'errors', 0]) || String(error));
        } else {
          goToPath(applicationsList);
        }
      })
    );
  }
}
