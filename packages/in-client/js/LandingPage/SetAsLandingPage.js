/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { getActiveConfiguration$ } from 'in-client/js/LandingPage/activeConfigration';
import connectTo from 'in-hoc/connectTo';

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
