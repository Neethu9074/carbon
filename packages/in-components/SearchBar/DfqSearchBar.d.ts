/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

interface DfqSearchBarProps {
  theme: 'light' | 'dark';
  withPadding?: boolean;
  manageFiltersDisabled?: boolean;
  presetsVisible?: boolean;
  onQueryValueChange: (query: string) => void;
  queryValue: string;
  disabled?: boolean;
}

const DfqSearchBar: (props: DfqSearchBarProps) => JSX.Element;
export default DfqSearchBar;
