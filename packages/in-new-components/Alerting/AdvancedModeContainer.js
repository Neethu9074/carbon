import React from 'react';

import ScrollStep from 'in-websites/eum-alerting/advanced/ScrollStep';
import { evaluateClassNames } from 'in-services/util/classnames';
import Button from 'in-new-components/Button/Button';
import SideNav from 'in-new-components/SideNav';
import SvgIcon from 'in-components/SvgIcon';

import locals from './AdvancedModeContainer.mless';

export default function AdvancedModeContainer(props) {
  const { form, onClose, onCreate, editMode, navItems } = props;

  return (
    <div className={locals.container}>
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
        <Button className={locals.button} onClick={() => onCreate()} disabled={form.touched && !form.hierarchyValid}>
          {editMode ? 'Save' : 'Create'}
        </Button>
      </nav>
    </div>
  );
}

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
