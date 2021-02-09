export interface WhoAmIModel {
  agent_id: number;
  team_id: number;
  bus_no: number;
  resource_server_base_uri: string;
  refresh_token_server_uri: string;
  expires_in: number;
  iss: string;
  sub: string;
}