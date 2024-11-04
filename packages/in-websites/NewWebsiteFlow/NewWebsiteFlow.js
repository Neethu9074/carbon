/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect, useRef, useState } from 'react';
import { createField } from 'formalistic';
import { get } from 'lodash';

import { interval } from '@instana/observables';

import ViewSwitcher from 'in-websites/WebsitesList/components/ViewSwitcher';
import { getWaitForEntityCreationTimeConfig } from 'in-stores/time/config';
import { useGenerateLinkToWebsite } from 'in-websites/navigation/paths';
import { useWebsiteTracker } from 'in-websites/tracking/segTracker';
import { notBlankValidator } from 'in-services/validators/string';
import getWebsite from 'in-websites/subscriptions/getWebsite';
import InputStep from 'in-websites/NewWebsiteFlow/InputStep';
import ReadyStep from 'in-websites/NewWebsiteFlow/ReadyStep';
import WaitStep from 'in-websites/NewWebsiteFlow/WaitStep';
import { combineDataAndError } from 'in-services/util/ro';
import { addWebsite } from 'in-websites/api/websites';
import Footer from 'in-components/Footer';
import Sticky from 'in-components/Sticky';
import Title from 'in-components/Title';
import { t } from 'in-i18n';

export default function NewWebsiteFlow() {
  const { addWebsiteTracker } = useWebsiteTracker();
  const [state, setState] = useState({
    field: createField({ value: '', validator: notBlankValidator }),
    saveError: null,
    saveResult: null,
    loading: false,
    trackSessions: true,
    enableSRI: true
  });

  const { field, websiteId, website } = state;

  const saveSubscription = useRef();
  const websiteSubscription = useRef();

  useEffect(
    () => () => {
      saveSubscription.current?.dispose();
      websiteSubscription.current?.dispose();
    },
    []
  );

  const getLinkToWebsite = useGenerateLinkToWebsite();
  const onChange = e => {
    setState(prevState => ({
      ...prevState,
      field: state.field.setValue(e.target.value).setTouched(true)
    }));
  };

  const onSubmit = e => {
    e.preventDefault();

    if (!field.valid) {
      setState(prevState => ({
        ...prevState,
        field: field.setTouched(true)
      }));
      return;
    }

    setState(prevState => ({
      ...prevState,
      loading: true,
      saveError: null
    }));

    addWebsiteTracker({ websiteName: field.value });

    saveSubscription.current = combineDataAndError(addWebsite(field.value)).once(({ data, error }) => {
      if (error) {
        setState(prevState => ({
          ...prevState,
          loading: false,
          saveError: get(error, ['response', 'body', 'errors', 0]) || String(error)
        }));
      } else {
        setState(prevState => ({
          ...prevState,
          loading: false,
          saveError: null,
          saveResult: data,
          website: null,
          websiteId: data.id,
          websiteName: field.value
        }));

        websiteSubscription.current = interval(5000)
          .flatMap(millis =>
            getWebsite({
              id: data.id,

              // to break websocket subscription caching
              cacheBreaker: millis
            })
          )
          .filter(result => result.data)
          .once(website => setState(prevState => ({ ...prevState, website })));
      }
    });
  };

  const setTrackSessions = trackSessions => setState(prevState => ({ ...prevState, trackSessions }));
  const setEnableSRI = enableSRI => setState(prevState => ({ ...prevState, enableSRI }));

  let content;
  if (!websiteId) {
    content = <InputStep {...state} onChange={onChange} onSubmit={onSubmit} />;
  } else if (!website) {
    content = <WaitStep {...state} setTrackSessions={setTrackSessions} setEnableSRI={setEnableSRI} />;
  } else {
    content = (
      <ReadyStep
        {...state}
        setTrackSessions={setTrackSessions}
        setEnableSRI={setEnableSRI}
        websiteLink={getLinkToWebsite(websiteId, {
          timeConfig: getWaitForEntityCreationTimeConfig()
        })}
      />
    );
  }

  return (
    <Sticky header={<ViewSwitcher isWebsites />}>
      <Title title={t('in-websites:newWebsiteFlow.inputStepNewWebsiteTitle')} />
      {content}
      <Footer />
    </Sticky>
  );
}
