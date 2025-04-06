/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { ReactNode, useEffect, useRef, useState } from 'react';
import get from 'lodash/get';

import { Card, Button } from '@instana/components';
import { Disposable } from '@instana/observables';

//@ts-expect-error no declaration file found
// eslint-disable-next-line no-restricted-imports
import { remove } from 'in-plg/pages/WelcomePage/widgets/starredItems';
// @ts-expect-error needs migration to TS
import HelpParagraph from 'in-mobile-apps/MobileAppDashboard/tabs/Configuration/Options/HelpParagraph';
// eslint-disable-next-line no-restricted-imports
import { mobileApp } from 'in-plg/pages/WelcomePage/widgets/starredItems/types';
// @ts-expect-error needs migration to TS
import { mobileAppsPathFullyQualified } from 'in-mobile-apps/navigation/paths';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { useMobileTracker } from 'in-mobile-apps/tracking/segTracker';
import { removeMobileApp } from 'in-mobile-apps/api/mobileApps';
import { combineDataAndError } from 'in-services/util/ro';
import SaveError from 'in-components/form/SaveError';
import { t, Trans } from 'in-i18n';

import locals from './Remove.mless';

interface Props {
  mobileAppLabel: string;
  mobileAppId: string;
  data: {
    label: string;
  };
}

interface State {
  checkboxChecked: boolean;
  removeError?: ReactNode;
  loading: boolean;
}

const initialState = {
  checkboxChecked: false,
  removeError: null,
  loading: false
};

const Remove = (props: Props) => {
  const {
    data: { label },
    mobileAppId
  } = props;

  const { removeMobileAppTracker } = useMobileTracker();
  const [state, setState] = useState<State>(initialState);
  const { checkboxChecked, removeError, loading } = state;

  const subscriptionRef = useRef<Disposable | null>(null);

  useEffect(() => () => subscriptionRef.current?.dispose(), []);

  const { goToPath } = useNavigation();

  const onTickChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState(prevState => ({ ...prevState, checkboxChecked: e.target.checked }));
  };

  const onRemove = (e: React.MouseEvent) => {
    e.preventDefault();

    setState(prevState => ({
      ...prevState,
      loading: true,
      removeError: null
    }));

    removeMobileAppTracker({
      mobileAppName: props.mobileAppLabel
    });
    remove({ id: mobileAppId, type: mobileApp });

    subscriptionRef.current = combineDataAndError(removeMobileApp(mobileAppId)).once(({ error }) => {
      if (error) {
        setState(prevState => ({
          ...prevState,
          loading: false,
          saveError: get(error, ['response', 'body', 'errors', 0]) || String(error)
        }));
      } else {
        goToPath(mobileAppsPathFullyQualified);
      }
    });
  };

  return (
    <Card title={t('in-mobile-apps:dashboard.tabs.removeAppTitle')}>
      <HelpParagraph>
        <Trans i18nKey="in-mobile-apps:dashboard.tabs.removeAppHelp1" values={{ label: label }} />
      </HelpParagraph>
      <HelpParagraph>
        <strong>{t('in-mobile-apps:dashboard.tabs.removeAppHelp2')}</strong>
      </HelpParagraph>

      <div className={locals.confirmWrapper}>
        <input
          type="checkbox"
          checked={checkboxChecked}
          onChange={onTickChange}
          disabled={loading}
          className={locals.confirm}
        />
        {t('in-mobile-apps:dashboard.tabs.confirmUndone')}
      </div>

      {removeError && <SaveError>{removeError}</SaveError>}
      <Button kind="danger" disabled={loading || !checkboxChecked} onClick={onRemove} className={locals.button}>
        {t('in-mobile-apps:dashboard.tabs.removeAppBtn')}
      </Button>
    </Card>
  );
};

export default Remove;
