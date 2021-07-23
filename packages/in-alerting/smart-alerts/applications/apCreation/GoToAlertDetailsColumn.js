/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import PropTypes from 'prop-types';
import React from 'react';

import { Link, SvgIcon } from '@instana/components';

import { getLinkToAlertDetails } from './navigation/paths';
import theme from 'in-themes';
import { t } from 'in-i18n';

export default function GoToAlertDetailsColumn({ id, name, created }) {
  return (
    // The review of a component to visually hide things is still ongoing. in the meantime we use aria-label to provide
    // necessary information to AT users. Since we manually set i18n strings, at least we should have no issues with translation services.
    <Link
      href$={getLinkToAlertDetails({ id, created })}
      aria-label={t('in-alerting:smartAlerts.applications.apCreation.viewAlertDetails', { name })}
      external
    >
      <SvgIcon color={theme.lib.colors.N800Dark} type="lib_views_external_link" aria-hidden="true" focusable="false" />
    </Link>
  );
}

GoToAlertDetailsColumn.propTypes = {
  created: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
};
