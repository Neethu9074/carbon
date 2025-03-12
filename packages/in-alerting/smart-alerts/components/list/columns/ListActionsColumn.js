/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { IconButton } from '@instana/components';

import {
  ALERTING_DELETE_TRIGGER,
  ALERTING_EDIT,
  ALERTING_PAUSED,
  ALERTING_RESUMED,
  ALERTING_CLONE_TRIGGER
} from 'in-services/tracking/eventNames';
import { getTrackingAlertConfig } from 'in-alerting/smart-alerts/utils/segmentUtils';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { ADVANCED } from 'in-alerting/smart-alerts/data/constants';
import { MoreMenu, MoreMenuButton } from 'in-components/MoreMenu';
import { stopPropagation } from 'in-services/util/function';
import { playwithEnabled } from 'in-services/featureFlags';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/list/columns/ListActionsColumn.mless';

export function ListActionsColumn({ config, isLoading, actionHandlers = {}, icon }) {
  const { handleEdit, handleClone, handleToggleEnabled, handleDelete, handleEditNew, handleCloneNew } = actionHandlers;
  const { builtIn, enabled, id, name } = config;
  const [isSaving, setIsSaving] = useState(false);
  const [isMoreMenuSaving, setIsMoreMenuSaving] = useState(false);
  const { trackCta } = useSegmentTracking(); // For segment tracking
  const alertConfigForTracking = getTrackingAlertConfig(config, undefined);
  const hasSecondaryActions = handleEdit || handleClone || handleDelete;

  const moreMenuIcon = icon ? icon : 'lib_menu_more_horizontal';

  useEffect(() => {
    if (!isLoading && (isSaving || isMoreMenuSaving)) {
      setIsSaving(false);
      setIsMoreMenuSaving(false);
    }
    // We only want to fire the hook when is loading changes to ensure that we
    // reset the loading spinner when the new entities are loaded from backend
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  return (
    <HorizontalFlexWrapper className={locals.actions}>
      {handleToggleEnabled && !playwithEnabled && (
        <Tooltip content={getTooltipForAction(config.readOnly)} delay={500}>
          <div className={locals.separator}>
            <IconButton
              kind="primaryv2"
              type={isSaving ? 'lib_actions_loading' : enabled ? 'lib_actions_pause' : 'lib_actions_play'}
              iconSpinning={isSaving}
              disabled={config.readOnly}
              onClick={e => {
                e.preventDefault();
                stopPropagation(e);
                handleToggleEnabled(enabled, id, setIsSaving);
                if (enabled) {
                  trackCta(ALERTING_PAUSED, alertConfigForTracking);
                } else {
                  trackCta(ALERTING_RESUMED, alertConfigForTracking);
                }
              }}
            />
          </div>
        </Tooltip>
      )}

      {hasSecondaryActions && !playwithEnabled && config.readOnly && <div className={locals.readOnlySeparator} />}
      {hasSecondaryActions && !playwithEnabled && !config.readOnly && (
        <MoreMenu
          renderInteractiveElement={({ ref, toggle }) => (
            <div className={locals.separator}>
              <IconButton
                kind="info"
                type={isMoreMenuSaving ? 'lib_actions_loading' : moreMenuIcon}
                onClick={e => {
                  e.preventDefault();
                  stopPropagation(e);
                  toggle();
                }}
                ref={ref}
                iconSpinning={isMoreMenuSaving}
                className={locals.darkButton}
              />
            </div>
          )}
          iconDescription={t('in-alerting:components.options')}
          align="left"
        >
          {handleEdit && (
            <MoreMenuButton
              icon={isSaving ? 'lib_actions_loading' : 'lib_actions_edit'}
              iconSpinning={isMoreMenuSaving}
              onClick={() => {
                handleEdit(config);
                trackCta(ALERTING_EDIT, { ...alertConfigForTracking, dialogMode: ADVANCED });
              }}
            >
              {t('in-alerting:smartAlerts.applications.inventory.labelActionButtonEdit')}
            </MoreMenuButton>
          )}
          {handleEditNew && !builtIn && handleEditNew(config)}
          {handleClone && (
            <MoreMenuButton
              icon="lib_actions_copy"
              onClick={() => {
                trackCta(ALERTING_CLONE_TRIGGER, { alertConfigForTracking, dialogMode: ADVANCED });
                handleClone(config);
              }}
            >
              {t('in-alerting:smartAlerts.applications.inventory.labelActionButtonDuplicate')}
            </MoreMenuButton>
          )}
          {handleCloneNew && !builtIn && handleCloneNew(config)}
          {!builtIn && handleDelete && (
            <MoreMenuButton
              icon="lib_actions_delete"
              onClick={() => {
                handleDelete(id, setIsMoreMenuSaving, name, trackCta);
                trackCta(ALERTING_DELETE_TRIGGER, alertConfigForTracking);
              }}
            >
              {t('in-alerting:smartAlerts.applications.inventory.labelActionButtonDelete')}
            </MoreMenuButton>
          )}
        </MoreMenu>
      )}
    </HorizontalFlexWrapper>
  );

  function getTooltipForAction(isReadOnly = false) {
    if (isReadOnly) {
      return t('in-alerting:smartAlerts.applications.inventory.noPermissionGlobalSmartAlertEdit');
    }

    if (isSaving) {
      return '';
    }

    return enabled ? t('in-alerting:smartAlerts.disable') : t('in-alerting:smartAlerts.enable');
  }
}

ListActionsColumn.propTypes = {
  config: PropTypes.shape({
    enabled: PropTypes.bool.isRequired,
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    builtIn: PropTypes.bool,
    readOnly: PropTypes.bool
  }).isRequired,
  isLoading: PropTypes.bool,
  actionHandlers: PropTypes.shape({
    handleEdit: PropTypes.func,
    handleClone: PropTypes.func,
    handleToggleEnabled: PropTypes.func,
    handleDelete: PropTypes.func
  }),
  icon: PropTypes.string
};
