/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

// There are likely others
type Mode = 'application/json' | 'shell' | 'markdown';

interface CodeProps {
  mode: Mode;
  value?: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  lineNumbers?: boolean;
  lineWrapping?: boolean;
  // This is derived from usage, it might not actually be supported
  hasError?: boolean;
}

const Code: (props: CodeProps) => JSX.Element;
export default Code;
