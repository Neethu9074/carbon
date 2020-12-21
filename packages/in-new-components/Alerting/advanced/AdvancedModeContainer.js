import PropTypes from 'prop-types';
import React from 'react';

import FormFooter, { SaveButton, CancelButton } from 'in-components/form/FormFooter/FormFooter';
import ScrollStep from 'in-new-components/Alerting/advanced/ScrollStep';
import classNames from 'classnames';
import SideNav from 'in-new-components/SideNav';
import SvgIcon from 'in-components/SvgIcon';

import locals from './AdvancedModeContainer.mless';

export default function AdvancedModeContainer({ form, onClose, onCreate, editMode, navItems, isSaving }) {
  return (
    <nav className={locals.container}>
      <div className={locals.scrollWrapper}>
        <div className={locals.content}>
          {navItems.map(({ scrollId, label, title, content }) => (
            <ScrollStep key={label} id={scrollId}>
              <h2 className={locals.title}>{title}</h2>
              {content}
              <div className={locals.divider} />
            </ScrollStep>
          ))}
        </div>
      </div>
      <div className={locals.sideNav}>
        <SideNav navItems={navItems} renderPostIcon={renderIcon} />
      </div>
      <FormFooter className={locals.controls}>
        <CancelButton onClick={() => onClose()} />
        <SaveButton onClick={() => onCreate()} isSaving={isSaving} form={form}>
          {editMode ? 'Save' : 'Create'}
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
  navItems: PropTypes.arrayOf(PropTypes.object).isRequired,
  isSaving: PropTypes.bool
};

function renderIcon({ checked }) {
  return (
    <SvgIcon
      className={classNames({
        [locals.icon]: true,
        [locals.checked]: checked
      })}
      type="lib_check"
      size="xxs"
    />
  );
}
