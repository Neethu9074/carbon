import React from 'react';

import Form from 'in-applications/NewApplication/Form';

import locals from './NewApplicationPresenter.mless';

export default function NewApplicationPresenter() {
  return (
    <div className={locals.wrapper}>
      <Form />
    </div>
  );
}
