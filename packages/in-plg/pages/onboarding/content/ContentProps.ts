/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

export default interface ContentProps {
  id: string;
  title: string;
  label: string;
  icon: string;
  iconColor?: string;
  fullLabel?: string;
  category?: string;
  Content?: JSX.Element;
  __score?: number;
  subTechnology?: SubTechnology;
}

export interface SubTechnology {
  label?: string;
  keyWords?: string;
  Content?: any;
  __score?: number;
}
