/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getActiveConfiguration$ } from 'in-client/js/LandingPage/activeConfigration';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const label = t('in-client:landingPage.makeDefault');
const icon = 'lib_views_grid';

export default connectTo(({ isLandingPage }) => ({
  isAlreadyLandingPage: getActiveConfiguration$().map(({ pageKey }) => isLandingPage(pageKey))
}))(SetAsLandingPage);

function SetAsLandingPage({ isAlreadyLandingPage, children }) {
  if (isAlreadyLandingPage) {
    return null;
  }
  return children({ isAlreadyLandingPage, label, icon });
}
