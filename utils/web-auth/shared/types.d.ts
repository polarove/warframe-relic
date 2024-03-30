export interface CredentialKey {
  id: string
  publicKey: string
  algorithm: 'RS256' | 'ES256'
}

export interface RegistrationEncoded {
  username: string
  credential: CredentialKey
  authenticatorData: string
  clientData: string
  attestationData?: string
}
