/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { SvgIcon } from '@instana/components';

import ScrollStep from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/ScrollStep';
import FormFooter, { SaveButton, CancelButton } from 'in-components/form/FormFooter/FormFooter';
import Divider from 'in-new-components/workspace/Divider';
import Header from 'in-new-components/workspace/Header';
import SideNav from 'in-new-components/SideNav';
import Stack from 'in-components/layout/Stack';
import { t } from 'in-i18n';

import locals from './AdvancedModeContainer.mless';

export default function AdvancedModeContainer({
  form,
  onClose,
  onCreate,
  editMode,
  navItems,
  isSaving,
  additionalValidationCheck = () => true
}) {
  return (
    <nav className={locals.container}>
      <div className={locals.scrollWrapper}>
        <div className={locals.content}>
          <Stack space="large">
            {navItems.map(({ scrollId, title, content }, i) => (
              <Fragment key={scrollId}>
                <ScrollStep id={scrollId}>
                  <Stack space="normal">
                    <Header>{title}</Header>
                    {content}
                  </Stack>
                </ScrollStep>
                {i + 1 < navItems.length && <Divider />}
              </Fragment>
            ))}
          </Stack>
        </div>
      </div>
      <div className={locals.sideNav}>
        <SideNav navItems={navItems} renderPostIcon={renderIcon} />
      </div>
      <FormFooter className={locals.controls}>
        <CancelButton onClick={() => onClose()} />

        <SaveButton
          onClick={() => onCreate()}
          isSaving={isSaving}
          form={form}
          disabled={!form.hierarchyValid || !additionalValidationCheck()}
        >
          {editMode
            ? t('in-alerting:smartAlerts.components.smartAlertDialog.buttonSave')
            : t('in-alerting:smartAlerts.components.smartAlertDialog.buttonCreate')}
        </SaveButton>
      </FormFooter>
    </nav>
  );
}

AdvancedModeContainer.propTypes = {
  form: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  editMode: PropTypes.bool,
  navItems: PropTypes.arrayOf(
    PropTypes.shape({
      scrollId: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      checked: PropTypes.bool,
      valid: PropTypes.bool,
      content: PropTypes.element
    })
  ).isRequired,
  isSaving: PropTypes.bool,
  /**
   * Defines addtional validation logic to control the disabled state of the Create button.
   * It enhances the form validation and does not replace it.
   */
  additionalValidationCheck: PropTypes.func
};

function renderIcon({ checked, valid }) {
  const invalid = checked && !valid;
  return (
    <SvgIcon
      className={classNames({
        [locals.icon]: true,
        [locals.checked]: checked,
        [locals.invalid]: invalid
      })}
      type={invalid ? 'lib_help_error_error_circle' : 'lib_check'}
      size="xs"
    />
  );
}
