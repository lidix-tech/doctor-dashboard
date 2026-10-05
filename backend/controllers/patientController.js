import db from "../db.js";

//we will need a lot more functions besides get
//all crud operations too

export async function getPatients(req, res) {
  try {
    //temporary
    const doctorId = req.user.doctor_id;

    //sql query to get patients
    const [patients] = await db.query(
      `SELECT
      p.patient_id,
      p.first_name,
      p.last_name,
      p.phone_number,
      p.prescription_text,
      p.exercise_text,
      p.next_follow_up_date,
      pr.pain_score,
      pr.report_date
   FROM patient p
   LEFT JOIN (
      SELECT
          patient_id,
          pain_score,
          report_date,
          ROW_NUMBER() OVER (
              PARTITION BY patient_id
              ORDER BY report_date DESC
          ) AS rn
      FROM painreport 
   ) pr
   ON p.patient_id = pr.patient_id
   AND pr.rn = 1
   WHERE p.doctor_id = ?`,
      [doctorId],
    );

    //console.log(patients);

    //for now our response will be a res.json
    res.json(patients);
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).json({ message: "Failed to fetch patients" });
  }
}

export async function getPatientById(req, res) {
  try {
    const { patientId } = req.params;
    const doctorId = req.user.doctor_id;

    const [rows] = await db.query(
      `SELECT
          patient_id,
          first_name,
          last_name,
          phone_number,
          prescription_text,
          exercise_text,
          next_follow_up_date
       FROM patient
       WHERE patient_id = ?
       AND doctor_id = ?`,
      [patientId, doctorId],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error getting patient:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
}

export async function updatePatient(req, res) {
  try {
    const { patientId } = req.params;
    const doctorId = req.user.doctor_id;

    const { prescription_text, exercise_text, next_follow_up_date } = req.body;

    const [result] = await db.query(
      `UPDATE patient
       SET prescription_text = ?,
           exercise_text = ?,
           next_follow_up_date = ?
       WHERE patient_id = ?
       AND doctor_id = ?`,
      [
        prescription_text,
        exercise_text,
        next_follow_up_date,
        patientId,
        doctorId,
      ],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }

    res.json({
      message: "Patient updated successfully",
    });
  } catch (error) {
    console.error("Error updating patient:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
}

export async function createPatient(req, res) {
  try {
    // getting our name and variables
    const doctorID = req.user.doctor_id;
    const { name, phone_number } = req.body;

    // Validate required fields
    if (
      typeof name !== "string" ||
      name.trim().length === 0 ||
      typeof phone_number !== "string" ||
      phone_number.trim().length === 0
    ) {
      return res
        .status(400)
        .json({ message: "Name and phone number are required" });
    }

    const parts = name.trim().split(/\s+/);
    const firstName = parts[0];
    const lastName = parts.slice(1).join(" ") || null;

    //insert into database
    const [result] = await db.query(
      `INSERT INTO patient
      (doctor_id, first_name, last_name, phone_number)
      VALUES (?, ?, ?, ?)`,
      [doctorID, firstName, lastName, phone_number],
    );

    //show it worked?
    res.status(201).json({
      message: "Patient created successfully",
      patient_id: result.insertId,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create patient",
    });
  }
}
//all to get a doctors name yayy
export async function getCurrentDoctor(req, res) {
  try {
    const doctorId = req.user.doctor_id;

    const [rows] = await db.query(
      `SELECT doctor_id, first_name, last_name
       FROM doctor
       WHERE doctor_id = ?`,
      [doctorId],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to get doctor",
    });
  }
}
export async function deletePatient(req, res) {
  try {
    const patientId = req.params.patientId;
    const doctorId = req.user.doctor_id;

    const [result] = await db.query(
      `DELETE FROM patient
       WHERE patient_id = ?
       AND doctor_id = ?`,
      [patientId, doctorId],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }

    res.json({
      message: "Patient deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to delete patient",
    });
  }
}
