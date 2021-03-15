/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import SetAsLandingPage from 'in-client/js/LandingPage/SetAsLandingPage';
import MoreMenuButton from 'in-new-components/MoreMenu/MoreMenuButton';

export default function MoreMenuSetAsLandingPageButton({ setLandingPage, isLandingPage }) {
  return (
    <SetAsLandingPage isLandingPage={isLandingPage}>
      {({ isAlreadyLandingPage, label, icon }) =>
        !isAlreadyLandingPage && (
          <MoreMenuButton icon={icon} onClick={setLandingPage}>
            {label}
          </MoreMenuButton>
        )
      }
    </SetAsLandingPage>
  );
}
