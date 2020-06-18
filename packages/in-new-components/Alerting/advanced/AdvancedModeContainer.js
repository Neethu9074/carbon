import PropTypes from 'prop-types';
import React from 'react';

import SaveCancelFooter from 'in-new-components/SaveCancelFooter/SaveCancelFooter';
import ScrollStep from 'in-new-components/Alerting/advanced/ScrollStep';
import { evaluateClassNames } from 'in-services/util/classnames';
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
      <SaveCancelFooter
        className={locals.controls}
        onCancelClick={() => onClose()}
        onSaveClick={() => onCreate()}
        editMode={editMode}
        isSaving={isSaving}
        form={form}
        canSaveItem={true}
      />
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
