import type { Tables } from './database.types';

export type ApiKey = Tables<'api_keys'>;

export interface ApiKeyWithRawKey extends ApiKey {
  rawKey: string;
}

export interface CreateApiKeyRequest {
  name: string;
}

export interface CreateApiKeyResponse {
  key: ApiKey;
  rawKey: string;
}

export interface ListApiKeysResponse {
  keys: ApiKey[];
}

export interface RevokeApiKeyResponse {
  id: string;
}
