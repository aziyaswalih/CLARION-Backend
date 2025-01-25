export class OtpEntity {
    constructor(
      public userId: string,
      public otp: string,
      public createdAt: Date,
      public expiresAt: Date
    ) {}
   
    isValid(): boolean {
      return new Date() < this.expiresAt;
    }
    
  }
  