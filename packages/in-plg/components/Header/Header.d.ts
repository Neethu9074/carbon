/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

export interface HeaderProps {
  crumbs: Array<{
    title?: string;
    icon?: string;
  }>;
}

declare const Header: (props: HeaderProps) => JSX.Element;
export default Header;
