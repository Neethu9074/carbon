/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { SvgIcon, Stack } from '@instana/components';

import ScrollStep from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/ScrollStep';
import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter';
import Divider from 'in-components/workspace/Divider';
import Header from 'in-components/workspace/Header';
import SideNav from 'in-components/SideNav';

import locals from './AdvancedModeContainer.mless';

export default function AdvancedModeContainer({ navItems, error }) {
  return (
    <nav className={locals.container}>
      <div className={locals.scrollWrapper}>
        <div className={locals.content}>
          <Stack gap="large">
            {navItems.map(({ scrollId, title, content }, i) => (
              <Fragment key={scrollId}>
                <ScrollStep id={scrollId}>
                  <Stack gap="normal">
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
      {error && (
        <div className={locals.errorInfo}>
          <ErroneousResultPresenter errors={[error]} />
        </div>
      )}
    </nav>
  );
}

AdvancedModeContainer.propTypes = {
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
  error: PropTypes.shape({
    message: PropTypes.string.isRequired,
    code: PropTypes.string
  })
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
