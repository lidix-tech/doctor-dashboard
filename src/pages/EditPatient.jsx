import "./EditPatient.css";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { AuthContext } from "../auth/AuthProvider.jsx";
import { useContext } from "react";

function EditPatient() {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const { apiFetch } = useContext(AuthContext);
  const [patient, setPatient] = useState(null);
  const [prescription, setPrescription] = useState("");
  const [exercise, setExercise] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");

  useEffect(() => {
    async function loadPatient() {
      const response = await apiFetch(`/patients/${patientId}`);

      const data = await response.json();

      setPatient(data);

      setPrescription(data.prescription_text || "");
      setExercise(data.exercise_text || "");

      // const formattedDate = data.next_follow_up_date
      //   ? new Date(data.next_follow_up_date).toLocaleDateString("en-GB")
      //   : "";

      setFollowUpDate(
        data.next_follow_up_date
          ? data.next_follow_up_date.substring(0, 10)
          : "",
      );
    }

    loadPatient();
  }, [patientId, apiFetch]);

  const handleDeletePatient = async () => {
    //prompt browser first
    const confirmed = window.confirm(
      "Are you sure you want to delete this patient?",
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await apiFetch(`/patients/${patientId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(data.message);
        return;
      }

      console.log(data.message);

      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to delete patient:", error);
    }
  };

  if (!patient) {
    return <div>Loading...</div>;
  }

  //save our form data by calling that put route which in patient
  //controller changes the data in our backend by sending a mysql
  //query

  async function handleSaveChanges() {
    // console.log("start of save function");
    //event.preventDefault();

    const response = await apiFetch(`/patients/${patientId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prescription_text: prescription,
        exercise_text: exercise,
        next_follow_up_date: followUpDate,
      }),
    });

    const data = await response.json();

    console.log(data);

    if (response.ok) {
      navigate("/dashboard");
    }
  }

  return (
    <div className="OuterEditPatientContainer">
      <div className="EditPatientContainer">
        <div className="HeaderPart">
          <div className="test">
            <h1>
              {patient.first_name} {patient.last_name}
            </h1>
            <p>Patient since placeholder date</p>
          </div>
          <div className="DeleteButtonContainer">
            <button className="Delete" onClick={handleDeletePatient}>
              Delete Patient
            </button>
          </div>
        </div>
        <form>
          <div className="EnterData">
            <div className="PrescriptionData">
              <label>Today's Prescription</label>
              <br />
              <input
                className="EnterPrescriptionData"
                type="text"
                value={prescription}
                onChange={(e) => setPrescription(e.target.value)}
                placeholder="Enter medicines"
              />
            </div>
            <div className="ExcerciseData">
              <label>Today's Excercise</label>
              <br />
              <input
                className="EnterExcerciseData"
                type="text"
                value={exercise}
                onChange={(e) => setExercise(e.target.value)}
                placeholder="Enter exercises"
              />
            </div>
            <div className="FollowUpDate">
              <label>Next Follow-up Date</label>
              <br />
              <input
                className="EnterFollowUpDate"
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
              />
            </div>
          </div>

          <div className="ButtonSection">
            <div>
              <button
                className="SaveChange"
                type="button"
                onClick={handleSaveChanges}
              >
                Save Changes
              </button>
            </div>
            <div>
              <button
                className="Cancel"
                onClick={() => {
                  navigate("/dashboard");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
export default EditPatient;
