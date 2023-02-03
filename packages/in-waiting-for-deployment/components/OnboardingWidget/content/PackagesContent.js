/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { Description, Script } from 'in-waiting-for-deployment/components/OnboardingWidget/contentComponents';
import { instanaDomain } from 'in-waiting-for-deployment/components/OnboardingWidget/content/configuration';
import { t } from 'in-i18n';

export default function PackagesContent({ downloadKey }) {
  return (
    <>
      <Description
        lines={[
          t('in-waiting-for-deployment:content.weMakeAvailableRegularlyUpdatedRpmAndDebPackagesAtTheFollowingAddress')
        ]}
      />
      <Script lines={[`https://_:${downloadKey}@packages.instana.${instanaDomain}/agent/download`]} />
    </>
  );
}
