import React from 'react';

import { Th, SortableTh } from 'in-components/tables/sharedComponents';
import CheckboxFancy from 'in-components/form/CheckboxFancy';
import Overlay from 'in-new-components/overlays/Overlay';
import Button from 'in-new-components/Button';
import SvgIcon from 'in-components/SvgIcon';

import locals from './ConfigurableTh.mless';

export default function ConfigurableTh(props) {
  const { isSortedByThisColumn, sortDirection, onClick, children, sortable } = props;

  const wrapContent = content => <ConfigureButton {...props}>{content}</ConfigureButton>;

  if (sortable === false) {
    return (
      <Th {...props} wrapContent={wrapContent}>
        {children}
      </Th>
    );
  }

  return (
    <SortableTh
      {...props}
      isSortedByThisColumn={isSortedByThisColumn}
      sortDirection={sortDirection}
      onClick={onClick}
      wrapContent={wrapContent}
    >
      {children}
    </SortableTh>
  );
}

function ConfigureButton({ availableColumnDefinitions, columnDefinitions, children, onColumnChecked }) {
  return (
    <div className={locals.wrapper}>
      {children}
      <Overlay
        withoutWrapper
        align="bottomRight"
        content={Content}
        props={{ availableColumnDefinitions, columnDefinitions, onColumnChecked }}
      >
        {({ toggle, refSetter }) => (
          <Button className={locals.button} kind="secondary" onClick={toggle} refSetter={refSetter}>
            <SvgIcon type="lib_actions_settings" width={24} height={24} />
          </Button>
        )}
      </Overlay>
    </div>
  );
}

function Content({ availableColumnDefinitions, columnDefinitions, onColumnChecked }) {
  const currentIds = columnDefinitions.map(def => def.id);

  return (
    <ul className={locals.list}>
      {availableColumnDefinitions.map(columnDefinition => {
        const isDisabled = !columnDefinition.optional;
        const isEnabled = currentIds.indexOf(columnDefinition.id) >= 0;
        return (
          <li key={columnDefinition.id} className={locals.item}>
            <CheckboxFancy
              checked={isDisabled || isEnabled}
              disabled={isDisabled}
              onChange={() => onColumnChecked(columnDefinition.id, !isEnabled)}
              size="large"
            />
            {columnDefinition.label}
          </li>
        );
      })}
    </ul>
  );
}
