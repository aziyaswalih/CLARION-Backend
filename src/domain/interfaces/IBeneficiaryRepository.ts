import { Beneficiary } from "../entities/BeneficiaryEntity";

export interface BeneficiaryRepository {
  create(beneficiary: Beneficiary): Promise<Beneficiary>;
  findById(id: string): Promise<Beneficiary | null>;
  findAll(): Promise<Beneficiary[]>; // Optional - for listing
  update(id: string, beneficiary: Beneficiary): Promise<Beneficiary | null>;
  delete(id: string): Promise<boolean>;
}
