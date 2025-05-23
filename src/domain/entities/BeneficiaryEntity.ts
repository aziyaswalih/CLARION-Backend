interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface FamilyDetails {
  membersCount: string;
  incomeLevel: string;
}

export interface Beneficiary {
  user: any;
  id?: string;
  // details: string;
  // condition: string;
  dateOfBirth: string;
  gender: string;
  identificationType: string;
  identificationNumber: string;
  address: Address;
  familyDetails: FamilyDetails;
  createdAt?: Date;
  updatedAt?: Date;
}
