import React from 'react';

export default function DialogRoot({children}) {
  // Dialogs must position themselves and add the backdrop!
  return (
    <div>
      {children}
    </div>
  );
}
