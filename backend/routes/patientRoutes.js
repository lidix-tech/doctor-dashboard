import express from "express";
import {
  getPatients,
  getPatientById,
  updatePatient,
  createPatient,
  getCurrentDoctor,
  deletePatient,
} from "../controllers/patientController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authenticate, getPatients);
router.get("/me", authenticate, getCurrentDoctor);
router.get("/:patientId", authenticate, getPatientById);
router.put("/:patientId", authenticate, updatePatient);
router.post("/", authenticate, createPatient);
router.delete("/:patientId", authenticate, deletePatient);

export default router;

//we need a get by id too

//edit patient component to use the edit patient route
//which is a crud operation
//that updates
//so it will be a router.post
//a router post that works for each specific id
// like /edit-patient/id=1
