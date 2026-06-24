export type CognitoParams = {
  response_type: 'code' | 'token';
  client_id: string;
  redirect_uri: string;
  scope: string[];
  identity_provider: string;
};
