/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import {
  trackAlertDeleteTrigger,
  trackAlertEdit,
  trackAlertPaused,
  trackAlertResumed,
  trackAlertCloneTrigger
} from 'in-alerting/smart-alerts/components/tracker';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import { MoreMenu, MoreMenuButton } from 'in-components/MoreMenu';
import IconButton from 'in-components/IconButton/IconButton';
import { stopPropagation } from 'in-services/util/function';
import { playwithEnabled } from 'in-services/featureFlags';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/list/columns/ListActionsColumn.mless';

export function ListActionsColumn({ config, isLoading, actionHandlers = {} }) {
  const { handleEdit, handleClone, handleToggleEnabled, handleDelete } = actionHandlers;
  const { builtIn, enabled, id, name } = config;
  const [isSaving, setIsSaving] = useState(false);
  const [isMoreMenuSaving, setIsMoreMenuSaving] = useState(false);

  const hasSecondaryActions = handleEdit || handleClone || handleDelete;

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
        <Tooltip content={getTooltipForAction()} delay={500}>
          <div className={locals.separator}>
            <IconButton
              kind="primaryv2"
              type={isSaving ? 'lib_actions_loading' : enabled ? 'lib_actions_pause' : 'lib_actions_play'}
              iconSpinning={isSaving}
              onClick={e => {
                e.preventDefault();
                stopPropagation(e);
                handleToggleEnabled(enabled, id, setIsSaving);
                if (enabled) {
                  trackAlertPaused(config);
                } else {
                  trackAlertResumed(config);
                }
              }}
            />
          </div>
        </Tooltip>
      )}

      {hasSecondaryActions && !playwithEnabled && (
        <MoreMenu
          renderInteractiveElement={({ ref, toggle }) => (
            <div className={locals.separator}>
              <IconButton
                kind="info"
                type={isMoreMenuSaving ? 'lib_actions_loading' : 'lib_menu_more_horizontal'}
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
        >
          {handleEdit && (
            <MoreMenuButton
              icon={isSaving ? 'lib_actions_loading' : 'lib_actions_edit'}
              iconSpinning={isMoreMenuSaving}
              onClick={() => {
                handleEdit(config);
                trackAlertEdit(config);
              }}
            >
              {t('in-alerting:smartAlerts.applications.inventory.labelActionButtonEdit')}
            </MoreMenuButton>
          )}
          {handleClone && (
            <MoreMenuButton
              icon="lib_actions_copy"
              onClick={() => {
                trackAlertCloneTrigger(config);
                handleClone(config);
              }}
            >
              {t('in-alerting:smartAlerts.applications.inventory.labelActionButtonDuplicate')}
            </MoreMenuButton>
          )}
          {!builtIn && handleDelete && (
            <MoreMenuButton
              icon="lib_actions_delete"
              onClick={() => {
                handleDelete(id, setIsMoreMenuSaving, name);
                trackAlertDeleteTrigger(config);
              }}
            >
              {t('in-alerting:smartAlerts.applications.inventory.labelActionButtonDelete')}
            </MoreMenuButton>
          )}
        </MoreMenu>
      )}
    </HorizontalFlexWrapper>
  );

  function getTooltipForAction() {
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
    builtIn: PropTypes.bool
  }).isRequired,
  isLoading: PropTypes.bool,
  actionHandlers: PropTypes.shape({
    handleEdit: PropTypes.func,
    handleClone: PropTypes.func,
    handleToggleEnabled: PropTypes.func,
    handleDelete: PropTypes.func
  })
};
