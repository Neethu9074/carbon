import React from 'react';

import Input from 'in-components/form/Input';
import SvgIcon from 'in-components/SvgIcon';

import locals from './OptionBox.mless';

export default function OptionBox({ checked, icon, title, description, onChange }) {
  return (
    <div className={locals.wrapper}>
      <Input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} autoComplete="off" />
      <SvgIcon type={icon} width={24} height={24} className={locals.icon} />
      <div className={locals.content}>
        <div className={locals.title}>{title}</div>
        <div className={locals.description}>{description}</div>
      </div>
    </div>
  );
}
