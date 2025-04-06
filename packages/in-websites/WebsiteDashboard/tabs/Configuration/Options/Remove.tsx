/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { get } from 'lodash';

import { Card, Button } from '@instana/components';
import { Disposable } from '@instana/observables';

//@ts-expect-error no declaration file found
// eslint-disable-next-line no-restricted-imports
import { remove } from 'in-plg/pages/WelcomePage/widgets/starredItems';
// eslint-disable-next-line no-restricted-imports
import { website } from 'in-plg/pages/WelcomePage/widgets/starredItems/types';
import HelpParagraph from 'in-websites/WebsiteDashboard/tabs/Configuration/Options/HelpParagraph';
import { websitesPathFullyQualified } from 'in-websites/navigation/paths';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { useWebsiteTracker } from 'in-websites/tracking/segTracker';
import { combineDataAndError } from 'in-services/util/ro';
import { removeWebsite } from 'in-websites/api/websites';
import SaveError from 'in-components/form/SaveError';
import { t, Trans } from 'in-i18n';

import locals from './Remove.mless';

interface Props {
  websiteLabel: string;
  websiteId: string;
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
  const { removeWebsiteTracker } = useWebsiteTracker();
  const {
    data: { label },
    websiteLabel,
    websiteId
  } = props;

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

    removeWebsiteTracker({ websiteName: websiteLabel });
    remove({ id: websiteId, type: website });

    subscriptionRef.current = combineDataAndError(removeWebsite(websiteId)).once(({ error }) => {
      if (error) {
        setState(prevState => ({
          ...prevState,
          loading: false,
          saveError: get(error, ['response', 'body', 'errors', 0]) || String(error)
        }));
      } else {
        goToPath(websitesPathFullyQualified);
      }
    });
  };

  return (
    <Card
      title={t('in-websites:websiteDashboard.tabs.configuration.configurationRemoveTitle')}
      headerClassName={locals.title}
      className={locals.configurationBlock}
    >
      <HelpParagraph>
        <Trans i18nKey="in-websites:delete.disclaimer" values={{ websiteName: label }} />
      </HelpParagraph>
      <HelpParagraph>
        <strong>{t('in-websites:websiteDashboard.tabs.configuration.configurationRemoveHelpParagraph')}</strong>
      </HelpParagraph>

      <div className={locals.confirmWrapper}>
        <input
          type="checkbox"
          checked={checkboxChecked}
          onChange={onTickChange}
          disabled={loading}
          className={locals.confirm}
        />
        {t('in-websites:websiteDashboard.tabs.configuration.configurationRemoveInput')}
      </div>

      {removeError && <SaveError>{removeError}</SaveError>}
      <Button kind="danger" disabled={loading || !checkboxChecked} onClick={onRemove} className={locals.button}>
        {t('in-websites:websiteDashboard.tabs.configuration.configurationRemoveButton')}
      </Button>
    </Card>
  );
};

export default Remove;
