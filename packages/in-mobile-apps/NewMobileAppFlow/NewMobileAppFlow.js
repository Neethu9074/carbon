/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createField } from 'formalistic';
import React, { useState } from 'react';
import { get } from 'lodash';

import { interval } from '@instana/observables';

import ViewSwitcher from 'in-websites/WebsitesList/components/ViewSwitcher';
import { getWaitForEntityCreationTimeConfig } from 'in-stores/time/config';
import { useGetLinkToMobileApp } from 'in-mobile-apps/navigation/paths';
import { useMobileTracker } from 'in-mobile-apps/tracking/segTracker';
import getMobileApp from 'in-mobile-apps/subscriptions/getMobileApp';
import { notBlankValidator } from 'in-services/validators/string';
import InputStep from 'in-mobile-apps/NewMobileAppFlow/InputStep';
import ReadyStep from 'in-mobile-apps/NewMobileAppFlow/ReadyStep';
import WaitStep from 'in-mobile-apps/NewMobileAppFlow/WaitStep';
import { addMobileApp } from 'in-mobile-apps/api/mobileApps';
import { combineDataAndError } from 'in-services/util/ro';
import Footer from 'in-components/Footer';
import Sticky from 'in-components/Sticky';
import Title from 'in-components/Title';
import { t } from 'in-i18n';

export default function NewMobileAppFlow() {
  const { addMobileAppTracker } = useMobileTracker();
  const [field, setField] = useState(createField({ value: '', validator: notBlankValidator }));
  const [mobileApp, setMobileApp] = useState(null);
  const [mobileAppId, setMobileAppId] = useState('');
  const [mobileAppName, setMobileAppName] = useState();
  const [saveError, setSaveError] = useState(null);
  const [loading, setLoading] = useState(false);

  const linkToMobileAppHref = useGetLinkToMobileApp(mobileAppId, {
    timeConfig: getWaitForEntityCreationTimeConfig()
  });

  function onChange(e) {
    setField(field.setValue(e.target.value).setTouched(true));
  }

  function onSubmit(e) {
    e.preventDefault();

    if (!field.valid) {
      setField(field.setTouched(true));
    }

    setLoading(true);
    setSaveError(null);

    addMobileAppTracker({
      mobileAppName: field.value
    });

    combineDataAndError(addMobileApp(field.value)).once(({ data, error }) => {
      if (error) {
        setLoading(false);
        setSaveError(get(error, ['response', 'body', 'errors', 0]) || String(error));
      } else {
        setLoading(false);
        setSaveError(null);
        setMobileApp(null);
        setMobileAppId(data.id);
        setMobileAppName(field.value);

        interval(5000)
          .flatMap(millis =>
            getMobileApp({
              id: data.id,

              // to break websocket subscription caching
              cacheBreaker: millis
            })
          )
          .filter(result => {
            return result.data;
          })
          .once(mobileApp => setMobileApp(mobileApp));
      }
    });
  }

  let content;
  if (!mobileAppId) {
    content = (
      <InputStep field={field} saveError={saveError} loading={loading} onChange={onChange} onSubmit={onSubmit} />
    );
  } else if (!mobileApp) {
    content = <WaitStep mobileAppId={mobileAppId} mobileAppName={mobileAppName} />;
  } else {
    content = (
      <ReadyStep mobileAppId={mobileAppId} mobileAppName={mobileAppName} linkToMobileAppHref={linkToMobileAppHref} />
    );
  }

  return (
    <Sticky header={<ViewSwitcher />}>
      <Title title={t('in-mobile-apps:newAppFlow.newMobileAppTitle')} />
      {content}
      <Footer />
    </Sticky>
  );
}
