const runtimes = [
  {
    key: 'dotnetcore',
    label: '.NET Core'
  },
  {
    key: 'go',
    label: 'Go'
  },
  {
    key: 'java',
    label: 'Java'
  },
  {
    key: 'node',
    label: 'Node.js'
  },
  {
    key: 'python',
    label: 'Python'
  },
  {
    key: 'ruby',
    label: 'Ruby'
  }
];

const unknownRuntime = {
  key: 'unknown',
  label: 'Unknown Runtime'
};

export function getRuntimeByKey(key) {
  if (!key) {
    return unknownRuntime;
  }
  const runtime = runtimes.find(runtime => key.indexOf(runtime.key) >= 0);
  if (runtime) {
    return runtime;
  }
  return unknownRuntime;
}
