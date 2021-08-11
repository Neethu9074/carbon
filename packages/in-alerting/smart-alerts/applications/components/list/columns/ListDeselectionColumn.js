/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import PropTypes from 'prop-types';
import React from 'react';

import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import IconButton from 'in-components/IconButton/IconButton';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './ListActionsColumn.mless';

export default function ListDeselectionColumn({ config, onDeselect }) {
  const { id } = config;
  return (
    <HorizontalFlexWrapper className={locals.actions}>
      <Tooltip content={t('in-alerting:smartAlerts.applications.inventory.labelRemove')}>
        <IconButton kind="primaryv2" type="lib_openclose_remove_circle_outline" onClick={() => onDeselect(id)} />
      </Tooltip>
    </HorizontalFlexWrapper>
  );
}

ListDeselectionColumn.propTypes = {
  config: PropTypes.shape({
    id: PropTypes.string.isRequired
  }).isRequired,
  onDeselect: PropTypes.func.isRequired
};
