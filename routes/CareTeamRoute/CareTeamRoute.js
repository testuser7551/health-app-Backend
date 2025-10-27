// routes/providerRoutes.js
import express from "express";
import { getUserCareTeamProviders, searchProviders, addProviderToCareTeam, removeProviderFromCareTeam } from "../../controllers/CareTeamController/providerController.js";
import { addCaregiver, getCaregivers, updateCaregiver, deleteCaregiver} from "../../controllers/CareTeamController/caregiverController.js";
import { addInsurance, getInsurances, updateInsurance, deleteInsurance } from "../../controllers/CareTeamController/insuranceController.js";

const router = express.Router();

//careteams
router.get("/get-providers", getUserCareTeamProviders);
router.post("/searchprovider", searchProviders);
router.post("/add-providers", addProviderToCareTeam);
router.post("/remove-provider", removeProviderFromCareTeam);

//careGivers
router.post("/caregivers-add", addCaregiver);      // Add new caregiver
router.get("/caregivers-get", getCaregivers);     // Get all caregivers for a user
router.put("/caregivers-edit/:caregiverId", updateCaregiver);  // Update caregiver
router.delete("/caregivers-delete/:caregiverId", deleteCaregiver);     // Delete caregiver

//Insurance
router.post("/insurance-add", addInsurance);
router.get("/insurance-get", getInsurances);
router.put("/insurance-edit/:insuranceId", updateInsurance);
router.delete("/insurance-delete/:insuranceId", deleteInsurance);

export default router;


