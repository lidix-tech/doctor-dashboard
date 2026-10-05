import "./AddPatient.css";
import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { AuthContext } from "../auth/AuthProvider";

function AddPatient() {
  const [patientName, setPatientName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const { apiFetch } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleCreatePatient = async () => {
    try {
      const response = await apiFetch("/patients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: patientName,
          phone_number: phoneNumber,
        }),
      });

      
    if (!response.ok) {
      throw new Error("Failed to create patient");
    }
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to create patient:", error);
    }
  };

  return (
    <div className="outerAddPatientContainer">
      <div className="AddPatientContainer">
        <div className="HeaderPart">
          <h1>Add New Patient</h1>
          {/* <p>Register a patient to your care list</p> */}
        </div>
        <div className="EnterData1">
          <form>
            <div className="PatientNameContainer">
              <label>Patient Name</label>
              <br />
              <input
                className="EnterPatientData"
                type="text"
                placeholder="Enter patient name"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
              />
            </div>
            <br />
            <div className="PhoneNumberContainer">
              <label>Phone Number</label>
              <br />
              <input
                className="EnterPatientData"
                type="text"
                placeholder="Enter phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
          </form>
        </div>
        <div className="ButtonSection">
          <button className="CreatePatient" onClick={handleCreatePatient}>
            Create Patient
          </button>
          <button className="Cancel1" onClick={() => navigate("/dashboard")}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddPatient;
