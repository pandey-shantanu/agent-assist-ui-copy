// TODO This is not the access token
export interface AcdToken {
  access_token?: string;
  token_type?: string;
  expires_in: number;
  refresh_token?: string;
  scope?: string;
  resource_server_base_uri: string;
  refresh_token_server_uri: string;
  agent_id: string;
  team_id: number;
  bus_no: number;
  basic_header?: string;
  sub?: string;
  act?: ActModel;
  iss?: string;
}

export interface ActModel {
  sub: string;
}