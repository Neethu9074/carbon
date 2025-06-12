/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import OnboardingProps from 'in-plg/pages/onboarding/content/OnboardingProps';

export default interface ContentProps {
  pageName: string;
  id: string;
  title: string;
  label: string;
  icon: string;
  fullLabel?: string;
  category?: string;
  keyWords?: string;
  Content?: (props: OnboardingProps) => JSX.Element;
  __score?: number;
  subTechnology?: SubTechnology;
}

export interface SubTechnology {
  label?: string;
  keyWords?: string;
  Content?: (props: OnboardingProps) => JSX.Element;
  __score?: number;
}
