import React from 'react';

import Button from 'in-new-components/Button';

import locals from './AddButton.mless';

export default function AddButton(props) {
  const { onClick, text } = props;

  return (
    <Button className={locals.addButton} kind="primary" onClick={onClick}>
      {text}
    </Button>
  );
}
