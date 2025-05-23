export class AuthTokenEntity {
  constructor(
    public token: string,
    public expiresAt: Date,
    public userId: string
  ) {}

  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }
}
