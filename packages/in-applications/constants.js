export const boundaryScopes = {
  default: 'inbound',
  inbound: 'inbound',
  all: 'all',

  info: {
    inbound: { text: 'Inbound Calls', icon: 'lib_application_boundary_inbound_calls' },
    all: { text: 'All Calls', icon: 'lib_application_boundary_all_calls' }
  }
};

export const switchScope = boundaryScope => {
  return boundaryScope === boundaryScopes.all ? boundaryScopes.inbound : boundaryScopes.all;
};
