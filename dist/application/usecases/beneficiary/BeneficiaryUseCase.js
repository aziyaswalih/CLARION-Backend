"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteBeneficiaryUseCase = exports.UpdateBeneficiaryUseCase = exports.ListBeneficiariesUseCase = exports.GetBeneficiaryUseCase = exports.SubmitBeneficiaryDetailsUseCase = void 0;
// 1. Submit Beneficiary Details Use Case
class SubmitBeneficiaryDetailsUseCase {
    beneficiaryRepository;
    constructor(beneficiaryRepository) {
        this.beneficiaryRepository = beneficiaryRepository;
    }
    async execute(beneficiaryData) {
        const createdBeneficiary = await this.beneficiaryRepository.create(beneficiaryData);
        return createdBeneficiary;
    }
}
exports.SubmitBeneficiaryDetailsUseCase = SubmitBeneficiaryDetailsUseCase;
// 2. Get Beneficiary Use Case
class GetBeneficiaryUseCase {
    beneficiaryRepository;
    constructor(beneficiaryRepository) {
        this.beneficiaryRepository = beneficiaryRepository;
    }
    async execute(beneficiaryId) {
        const beneficiary = await this.beneficiaryRepository.findById(beneficiaryId);
        return beneficiary;
    }
}
exports.GetBeneficiaryUseCase = GetBeneficiaryUseCase;
// 3. List Beneficiaries Use Case (Optional - Example)
class ListBeneficiariesUseCase {
    beneficiaryRepository;
    constructor(beneficiaryRepository) {
        this.beneficiaryRepository = beneficiaryRepository;
    }
    async execute() {
        const beneficiaries = await this.beneficiaryRepository.findAll();
        return beneficiaries;
    }
}
exports.ListBeneficiariesUseCase = ListBeneficiariesUseCase;
// 4. Update Beneficiary Use Case (Optional - Example)
class UpdateBeneficiaryUseCase {
    beneficiaryRepository;
    constructor(beneficiaryRepository) {
        this.beneficiaryRepository = beneficiaryRepository;
    }
    async execute(id, beneficiaryData) {
        console.log(id, beneficiaryData, "id beneficiary data 2");
        // 1. Validate input ID and data
        if (!id || !beneficiaryData) {
            console.log(id, beneficiaryData, "id beneficiary data");
            throw new Error("Beneficiary ID and details are required for update.");
        }
        // 3. Update beneficiary in the repository
        const updatedBeneficiary = await this.beneficiaryRepository.update(id, beneficiaryData);
        // 4. Return the updated beneficiary (or null if not found)
        return updatedBeneficiary;
    }
}
exports.UpdateBeneficiaryUseCase = UpdateBeneficiaryUseCase;
// 5. Delete Beneficiary Use Case (Optional - Example)
class DeleteBeneficiaryUseCase {
    beneficiaryRepository;
    constructor(beneficiaryRepository) {
        this.beneficiaryRepository = beneficiaryRepository;
    }
    async execute(beneficiaryId) {
        // 1. Validate input ID
        if (!beneficiaryId) {
            throw new Error("Beneficiary ID is required for deletion.");
        }
        const deletionResult = await this.beneficiaryRepository.delete(beneficiaryId);
        // 4. Return the deletion success status
        return deletionResult;
    }
}
exports.DeleteBeneficiaryUseCase = DeleteBeneficiaryUseCase;
