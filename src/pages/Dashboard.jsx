import "./Dashboard.css";
import PatientRow from "../components/PatientRow";
//import { useContext } from "react";
//import { AuthContext } from "../auth/AuthProvider.jsx";
//import { useEffect, useState } from "react";
//import apiFetch from "../api/apiFetch.js"
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../auth/AuthProvider";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  // Temporary data
  //const doctorName = "Dr. Sharma";
  const { logout, apiFetch } = useContext(AuthContext);
  const [patients, setPatients] = useState([]);
  const [doctor, setDoctor] = useState(null);

  //I REMEBER THE PAIN OF FIXING THIS PAIN IN THE ASS FUNCTION
  useEffect(() => {
    async function fetchPatients() {
      try {
        const doctorResponse = await apiFetch("/patients/me");

        if (!doctorResponse.ok) {
          throw new Error("Failed to fetch doctor");
        }

        const doctorData = await doctorResponse.json();
        setDoctor(doctorData);

        const response = await apiFetch("/patients");

        if (!response.ok) {
          throw new Error("Failed to fetch patients");
        }

        const data = await response.json();
        setPatients(data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
    }

    fetchPatients();
  }, [apiFetch]);

  // const patients = [
  //   {
  //     id: 1,
  //     name: "Anita Kapoor",
  //     pain: 6,
  //     lastAccess: "3:20pm",
  //     nextCheckup: "28-08-2026",
  //   },
  //   {
  //     id: 2,
  //     name: "Rajesh Menon",
  //     pain: 3,
  //     lastAccess: "1:45pm",
  //     nextCheckup: "02-09-2026",
  //   },
  //   {
  //     id: 3,
  //     name: "Priya Nair",
  //     pain: 8,
  //     lastAccess: "Yesterday",
  //     nextCheckup: "25-08-2026",
  //   },
  //   {
  //     id: 4,
  //     name: "Vikram Shah",
  //     pain: 2,
  //     lastAccess: "10:15am",
  //     nextCheckup: "10-09-2026",
  //   },
  //   {
  //     id: 5,
  //     name: "Neha Malhotra",
  //     pain: 5,
  //     lastAccess: "9:30am",
  //     nextCheckup: "30-08-2026",
  //   },
  //   {
  //     id: 6,
  //     name: "Arjun Mehta",
  //     pain: 7,
  //     lastAccess: "Yesterday",
  //     nextCheckup: "27-08-2026",
  //   },
  //   {
  //     id: 7,
  //     name: "Sneha Iyer",
  //     pain: 1,
  //     lastAccess: "8:50am",
  //     nextCheckup: "05-09-2026",
  //   },
  //   {
  //     id: 8,
  //     name: "Rohan Gupta",
  //     pain: 4,
  //     lastAccess: "2:10pm",
  //     nextCheckup: "01-09-2026",
  //   },
  //   {
  //     id: 9,
  //     name: "Ayesha Khan",
  //     pain: 9,
  //     lastAccess: "2 days ago",
  //     nextCheckup: "24-08-2026",
  //   },
  //   {
  //     id: 10,
  //     name: "Karan Bhat",
  //     pain: 3,
  //     lastAccess: "11:25am",
  //     nextCheckup: "12-09-2026",
  //   },
  //   {
  //     id: 11,
  //     name: "Meera Joshi",
  //     pain: 6,
  //     lastAccess: "Yesterday",
  //     nextCheckup: "29-08-2026",
  //   },
  //   {
  //     id: 12,
  //     name: "Aditya Verma",
  //     pain: 2,
  //     lastAccess: "4:05pm",
  //     nextCheckup: "07-09-2026",
  //   },
  //   {
  //     id: 13,
  //     name: "Kavya Reddy",
  //     pain: 5,
  //     lastAccess: "12:40pm",
  //     nextCheckup: "03-09-2026",
  //   },
  //   {
  //     id: 14,
  //     name: "Sameer Dar",
  //     pain: 7,
  //     lastAccess: "3 days ago",
  //     nextCheckup: "26-08-2026",
  //   },
  //   {
  //     id: 15,
  //     name: "Nisha Sharma",
  //     pain: 4,
  //     lastAccess: "9:15am",
  //     nextCheckup: "15-09-2026",
  //   },
  // ];

  return (
    <div className="outer">
      <div className="dashboard_Container">
        {/*text block 1*/}
        <div className="Header_part">
          <div className="part1">
            <h2>Doctor Dashboard</h2>
            <p>
              Dr. {doctor?.first_name} {doctor?.last_name} · {patients.length}{" "}
              active patients
            </p>
          </div>
          <div className="part2">
            <button onClick={() => navigate("/add-patient")}>
              Add Patient
            </button>
            <button className="Logout" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
        {/* Table container */}
        <div className="Table_Container">
          {/* Table header */}
          <div className="Table_Header">
            <div className="sections">Patient Name</div>
            <div className="sections">Daily Pain Report "temp"</div>
            <div className="sections">Last App Access "temp"</div>
            <div className="sections">Next Checkup</div>
            <div className="sections">Actions</div>
          </div>
          {/* Table contents i guess fuhh help me*/}
          {/* add a new component thats dynamic ahh */}
          <div className="Row_Container">
            {patients.map((patient) => (
              <PatientRow key={patient.patient_id} patient={patient} />
            ))}
            {/* <PatientRow/>
            <PatientRow/>
            <PatientRow/>
            <PatientRow/>
            <PatientRow/>
            <PatientRow/>
            <PatientRow/>
            <PatientRow/>
            <PatientRow/>
            <PatientRow/> */}
          </div>
        </div>
      </div>
    </div>
  );
}
export default Dashboard;
