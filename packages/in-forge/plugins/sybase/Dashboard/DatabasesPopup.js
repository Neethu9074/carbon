/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import KeyValueOverlay from 'in-sdk/components/sidebar/KeyValueOverlay';
import { emptyList } from 'in-services/fixedImmutables';
import { getRawPayload } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    return {
      databases: getRawPayload(props.snapshot.get('id'), 'databaseNames')
    };
  },
  function DatabasesPopup({ snapshot }) {
    let databases = snapshot.getIn(['data', 'databaseNames'], emptyList);
    return <KeyValueOverlay header={t('in-forge:plugins.sybase.headerDatabases')} data={databases} />;
  }
);
