import "./PatientRow.css";
import { useNavigate } from "react-router-dom";

function PatientRow({ patient }) {
  const navigate = useNavigate();

  return (
    <div className="patient_rows">
      <div className="section">{patient.first_name}</div>

      <div className="section">{patient.pain_score ?? "—"}</div>

      <div className="section">
        {patient.report_date
          ? new Date(patient.report_date).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "—"}
      </div>

      <div className="section">
        {patient.next_follow_up_date
          ? new Date(patient.next_follow_up_date).toLocaleDateString()
          : "—"}
      </div>

      <div className="section">
        <button className="edit" onClick={() => navigate(`/edit-patient/${patient.patient_id}`)}>
          Edit
        </button>
      </div>
    </div>
  );
}

export default PatientRow;
