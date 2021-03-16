/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

export default function withSelectableIds(ComposedComponent) {
  return function ComponentwithSelectableIds(props) {
    const prefilledMap = props.preSelectedItems
      ? new Map(props.preSelectedItems.map(({ id, type }) => [id, type]))
      : new Map();
    const [selectedEntities, setSelectedEntities] = useState(prefilledMap);

    const checkIfSelected = _id => selectedEntities.has(_id);
    const toggleItem = (_id, type) => {
      const copy = new Map(selectedEntities);
      if (checkIfSelected(_id)) {
        copy.delete(_id);
      } else {
        copy.set(_id, type);
      }
      setSelectedEntities(copy);
    };

    return (
      <ComposedComponent
        {...props}
        checkIfSelected={checkIfSelected}
        toggleItem={toggleItem}
        selectedEntities={selectedEntities}
      />
    );
  };
}
