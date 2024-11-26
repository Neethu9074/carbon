/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

export interface MappingRule {
  id: number;
  rule: string;
  replaceText: string;
}

export interface EnableAutoPageDetectionProps {
  pageTransitionMethod: string;
  setPageTransitionMethod: (value: string) => void;
  setRegexMappingRules: (value: any) => void;
}

export interface EnableRegexMappingRuleProps {
  setRegexMappingRules: (value: any) => void;
}

export interface MappingRuleRowProps {
  rule: MappingRule;
  updateRule: (id: number, field: keyof MappingRule, value: string) => void;
  deleteRule: (id: number) => void;
  isDeletable: boolean;
  ruleError?: string | null;
  replaceTextError?: string | null;
}

export interface RegexMappingRulesProps {
  setRegexMappingRules: (rules: MappingRule[]) => void;
}

export interface LearnMoreLinkProps {
  label: string;
  linkText: string;
  url: string;
}

export interface AutoPageTransitionDetectionProps {
  enableAutoPageDetection: boolean;
  setEnableAutoPageDetection: (value: boolean) => void;
  pageTransitionMethod: string;
  setRegexMappingRules: (value: any) => void;
  setPageTransitionMethod: (value: string) => void;
}

export interface FrameworkTypeSelectionProps {
  frameworkType: string;
  setFrameworkType: (value: string) => void;
  enableAutoPageDetection: boolean;
  setEnableAutoPageDetection: (value: boolean) => void;
  pageTransitionMethod: string;
  setPageTransitionMethod: (value: string) => void;
  setRegexMappingRules: (value: any) => void;
}
