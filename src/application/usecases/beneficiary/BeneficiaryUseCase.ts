import { ObjectId } from "mongoose";
import { Beneficiary } from "../../../domain/entities/BeneficiaryEntity";
import { BeneficiaryRepository } from "../../../domain/interfaces/IBeneficiaryRepository";

// 1. Submit Beneficiary Details Use Case
export class SubmitBeneficiaryDetailsUseCase {
  private beneficiaryRepository: BeneficiaryRepository;

  constructor(beneficiaryRepository: BeneficiaryRepository) {
    this.beneficiaryRepository = beneficiaryRepository;
  }

  async execute(beneficiaryData: Beneficiary): Promise<Beneficiary> {
    const createdBeneficiary = await this.beneficiaryRepository.create(
      beneficiaryData
    );
    return createdBeneficiary;
  }
}

// 2. Get Beneficiary Use Case
export class GetBeneficiaryUseCase {
  private beneficiaryRepository: BeneficiaryRepository;

  constructor(beneficiaryRepository: BeneficiaryRepository) {
    this.beneficiaryRepository = beneficiaryRepository;
  }

  async execute(beneficiaryId: string): Promise<Beneficiary | null> {
    const beneficiary = await this.beneficiaryRepository.findById(
      beneficiaryId
    );
    return beneficiary;
  }
}

// 3. List Beneficiaries Use Case (Optional - Example)
export class ListBeneficiariesUseCase {
  private beneficiaryRepository: BeneficiaryRepository;

  constructor(beneficiaryRepository: BeneficiaryRepository) {
    this.beneficiaryRepository = beneficiaryRepository;
  }

  async execute(): Promise<Beneficiary[]> {
    const beneficiaries = await this.beneficiaryRepository.findAll();

    return beneficiaries;
  }
}

// 4. Update Beneficiary Use Case (Optional - Example)
export class UpdateBeneficiaryUseCase {
  private beneficiaryRepository: BeneficiaryRepository;

  constructor(beneficiaryRepository: BeneficiaryRepository) {
    this.beneficiaryRepository = beneficiaryRepository;
  }

  async execute(
    id: string,
    beneficiaryData: Beneficiary
  ): Promise<Beneficiary | null> {
    console.log(id, beneficiaryData, "id beneficiary data 2");

    // 1. Validate input ID and data
    if (!id || !beneficiaryData) {
      console.log(id, beneficiaryData, "id beneficiary data");

      throw new Error("Beneficiary ID and details are required for update.");
    }

    // 3. Update beneficiary in the repository
    const updatedBeneficiary = await this.beneficiaryRepository.update(
      id,
      beneficiaryData
    );

    // 4. Return the updated beneficiary (or null if not found)
    return updatedBeneficiary;
  }
}

// 5. Delete Beneficiary Use Case (Optional - Example)
export class DeleteBeneficiaryUseCase {
  private beneficiaryRepository: BeneficiaryRepository;

  constructor(beneficiaryRepository: BeneficiaryRepository) {
    this.beneficiaryRepository = beneficiaryRepository;
  }

  async execute(beneficiaryId: string): Promise<boolean> {
    // 1. Validate input ID
    if (!beneficiaryId) {
      throw new Error("Beneficiary ID is required for deletion.");
    }

    const deletionResult = await this.beneficiaryRepository.delete(
      beneficiaryId
    );

    // 4. Return the deletion success status
    return deletionResult;
  }
}
