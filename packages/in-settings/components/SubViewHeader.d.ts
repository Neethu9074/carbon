/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

interface SubViewHeaderProps {
  children: React.ReactNode;
  iconType?: string;
  iconColor?: string;
}

declare function SubViewHeaderComponent(props: SubViewHeaderProps): JSX.Element;

export default SubViewHeaderComponent;
