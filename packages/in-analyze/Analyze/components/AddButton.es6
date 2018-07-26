import React from 'react';

import Button from 'in-new-components/Button';

import locals from './AddButton.mless';

export default function AddButton(props) {
  const { onClick, text } = props;

  return (
    <Button className={locals.addButton} icon="lib_openclose_add" kind="secondary" onClick={onClick}>
      {text}
    </Button>
  );
}
