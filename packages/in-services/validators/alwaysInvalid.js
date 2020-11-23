export function alwaysInvalidValidator(message = 'Always invalid') {
  return () => [
    {
      severity: 'error',
      message
    }
  ];
}
