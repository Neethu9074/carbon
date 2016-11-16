export const viewHelp =
`Configure how Instana uses HTTP request attributes to extract services. You can define multiple rules which will be
executed in order, i.e. the first rule of which all match expression match, will be used to extract a service name.`;

export const matchesHelp =
`Select here which HTTP request attributes should be used to match and extract a service. At least one match
expression is required. HTTP request attributes such as HTTP host headers and request paths can be matched
to extract services. When all of the configured match expressions match an HTTP request's attributes, a
service will be extracted.
`;

export const serviceNameHelp =
`Give this service a name. This service name will be used throughout Instana. You can reference capture groups
extracted from the match expressions to dynamically build a service name.
`;

export const commentHelp = `Describe the intent behind this rule for your colleagues and your future self.`;
