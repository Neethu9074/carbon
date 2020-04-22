import PropTypes from 'prop-types';
import React from 'react';

import ScrollStep from 'in-new-components/Alerting/advanced/ScrollStep';
import { evaluateClassNames } from 'in-services/util/classnames';
import SaveButton from 'in-components/form/SaveButton';
import Button from 'in-new-components/Button/Button';
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
      <nav className={locals.controls}>
        <Button className={locals.button} kind="secondary" onClick={() => onClose()}>
          Cancel
        </Button>
        <SaveButton className={locals.button} kind="primary" onClick={() => onCreate()} isSaving={isSaving} form={form}>
          {editMode ? 'Save' : 'Create'}
        </SaveButton>
      </nav>
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
      className={evaluateClassNames({
        [locals.icon]: true,
        [locals.checked]: checked
      })}
      type="lib_check"
      size="xxs"
    />
  );
}
