import React from 'react';

import locals from './TypeSuggestions.mless';

export default function TypeSuggestions({ onValueClick }) {
  return (
    <ul className={locals.suggestionList}>
      {['Batch', 'Database', 'Http', 'Messaging', 'Rpc', 'Undefined'].map(type => (
        <li key={type} className={locals.suggestion} onClick={() => onValueClick(type.toUpperCase())}>
          {type}
        </li>
      ))}
    </ul>
  );
}
