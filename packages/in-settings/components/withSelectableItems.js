import React, { useState } from 'react';

export default function withSelectableIds(ComposedComponent) {
  return function ComponentwithSelectableIds(props) {
    const [selectedEntities, setSelectedEntities] = useState(new Map());

    const checkIfSelected = _id => selectedEntities.has(_id);
    const toggleItem = (_id, _item) => {
      const copy = new Map(selectedEntities);
      if (checkIfSelected(_id)) {
        copy.delete(_id);
      } else {
        copy.set(_id, _item);
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
