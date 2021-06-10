/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import UrlShortenerOverlay from 'in-components/DashboardHeader/UrlShortener/UrlShortenerOverlay';
import DashboardHeaderButton from 'in-components/DashboardHeader/DashboardHeaderButton';
import { track, URL_SHORTENER_OPEN } from 'in-services/tracking/tracking';
import Overlay from 'in-components/overlays/Overlay';

export default function UrlShortener(props) {
  return (
    <Overlay props={props} content={UrlShortenerOverlay} withoutWrapper withoutArrow>
      {Button}
    </Overlay>
  );
}

function Button({ toggle, refSetter, darkTheme }) {
  return (
    <DashboardHeaderButton
      id="url-shortener-button"
      icon="lib_actions_interface_link"
      onClick={() => {
        track(URL_SHORTENER_OPEN);
        toggle();
      }}
      refSetter={refSetter}
      darkTheme={darkTheme}
    />
  );
}
