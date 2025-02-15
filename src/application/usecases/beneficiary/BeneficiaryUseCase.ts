// src/use_cases/beneficiary/BeneficiaryUseCases.ts

import { Beneficiary } from "../../../domain/entities/BeneficiaryEntity";
import { BeneficiaryRepository } from "../../../domain/interfaces/IBeneficiaryRepository";

// 1. Submit Beneficiary Details Use Case
export class SubmitBeneficiaryDetailsUseCase {
    private beneficiaryRepository: BeneficiaryRepository;

    constructor(beneficiaryRepository: BeneficiaryRepository) {
        this.beneficiaryRepository = beneficiaryRepository;
    }

    async execute(beneficiaryData: Beneficiary): Promise<Beneficiary> {
        // 1. Validate input data (Business rules, Domain logic)
        if (!beneficiaryData.details || !beneficiaryData.condition || !beneficiaryData.gender) {
            throw new Error("Beneficiary details, condition, and gender are required."); // Example validation
        }

        // 2. Business logic (e.g., enrich data, perform calculations, etc. - in this case, simple creation)

        // 3. Persist data using the repository
        const createdBeneficiary = await this.beneficiaryRepository.create(beneficiaryData);

        // 4. Return the result
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
        // 1. Validate input (if necessary, e.g., is beneficiaryId a valid format?)

        // 2. Retrieve beneficiary from repository
        const beneficiary = await this.beneficiaryRepository.findById(beneficiaryId);

        // 3. Business logic after retrieval (e.g., check permissions, etc. - simple retrieval in this case)

        // 4. Return the beneficiary (or null if not found)
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
        // 1. Business logic before listing (e.g., apply filters, check permissions, etc.)

        // 2. Retrieve beneficiaries from repository
        const beneficiaries = await this.beneficiaryRepository.findAll();

        // 3. Business logic after retrieval (e.g., sort, format, etc.)

        // 4. Return the list of beneficiaries
        return beneficiaries;
    }
}

// 4. Update Beneficiary Use Case (Optional - Example)
export class UpdateBeneficiaryUseCase {
    private beneficiaryRepository: BeneficiaryRepository;

    constructor(beneficiaryRepository: BeneficiaryRepository) {
        this.beneficiaryRepository = beneficiaryRepository;
    }

    async execute(id: string, beneficiaryData: Beneficiary): Promise<Beneficiary | null> {
        // 1. Validate input data and ID
        if (!id || !beneficiaryData.details) {
            throw new Error("Beneficiary ID and details are required for update.");
        }

        // 2. Business logic before update (e.g., authorization checks, data transformation)

        // 3. Update beneficiary in the repository
        const updatedBeneficiary = await this.beneficiaryRepository.update(id, beneficiaryData);

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

        // 2. Business logic before deletion (e.g., authorization checks, cascade deletion handling)

        // 3. Delete beneficiary from repository
        const deletionResult = await this.beneficiaryRepository.delete(beneficiaryId);

        // 4. Return the deletion success status
        return deletionResult;
    }
}