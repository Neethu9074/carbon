import React from 'react';

export default function Section({ children, title }) {
  return (
    <div
      style={{
        marginBottom: 16,
        paddingBottom: 16,
        borderBottom: '1px dashed #ccc'
      }}
    >
      <h3
        style={{
          fontWeight: 300,
          color: '#888'
        }}
      >
        {title}
      </h3>
      <br />
      {children}
    </div>
  );
}
