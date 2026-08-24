import { useEffect, useState } from "react";
import API from "./api";

function App() {
  const [applications, setApplications] = useState([]);

  const [form, setForm] = useState({
    company: "",
    position: "",
    location: "",
    status: "Applied",
    notes: "",
  });
  const [editingId, setEditingId] = useState(null);

  // Get all applications
  const fetchApplications = async () => {
    try {
      const response = await API.get("/applications");
      setApplications(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Load applications when page opens
  useEffect(() => {
    fetchApplications();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleDelete = async (id) => {
  try {
    await API.delete(`/applications/${id}`);

    alert("Application deleted!");

    fetchApplications();
  } catch (error) {
    console.log(error);
    alert("Failed to delete application");
  }
};

const handleEdit = (application) => {
  setEditingId(application._id);

  setForm({
    company: application.company,
    position: application.position,
    location: application.location,
    status: application.status,
    notes: application.notes,
  });
};

  // Add new application
 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    if (editingId) {
      await API.put(`/applications/${editingId}`, form);
      alert("Application updated successfully!");
      setEditingId(null);
    } else {
      await API.post("/applications", form);
      alert("Application added successfully!");
    }

    setForm({
      company: "",
      position: "",
      location: "",
      status: "Applied",
      notes: "",
    });

    fetchApplications();
  } catch (error) {
    console.log(error);
    alert("Operation failed");
  }
};

const totalApplications = applications.length;

const appliedCount = applications.filter(
  (app) => app.status === "Applied"
).length;

const interviewCount = applications.filter(
  (app) => app.status === "Interview"
).length;

const selectedCount = applications.filter(
  (app) => app.status === "Selected"
).length;

const rejectedCount = applications.filter(
  (app) => app.status === "Rejected"
).length;

  return (
    <div className="container">
      <h1>Job Application Tracker</h1>

      <div className="stats">
  <div className="stat-card">
    <h3>Total</h3>
    <p>{totalApplications}</p>
  </div>

  <div className="stat-card">
    <h3>Applied</h3>
    <p>{appliedCount}</p>
  </div>

  <div className="stat-card">
    <h3>Interview</h3>
    <p>{interviewCount}</p>
  </div>

  <div className="stat-card">
    <h3>Selected</h3>
    <p>{selectedCount}</p>
  </div>

  <div className="stat-card">
    <h3>Rejected</h3>
    <p>{rejectedCount}</p>
  </div>
</div>
      {/* Add Application Form */}
      <form onSubmit={handleSubmit}>
        <input
          name="company"
          placeholder="Company Name"
          value={form.company}
          onChange={handleChange}
          required
        />

        <input
          name="position"
          placeholder="Job Position"
          value={form.position}
          onChange={handleChange}
          required
        />

        <input
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
        />

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
        >
          <option value="Applied">Applied</option>
          <option value="Interview">Interview</option>
          <option value="Selected">Selected</option>
          <option value="Rejected">Rejected</option>
        </select>

        <textarea
          name="notes"
          placeholder="Notes"
          value={form.notes}
          onChange={handleChange}
        />

        <button type="submit">
  {editingId ? "Update Application" : "Add Application"}
</button>
      </form>

      {/* Applications List */}
      <h2>My Applications</h2>

      {applications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        applications.map((application) => (
          <div key={application._id}>
            <h3>{application.company}</h3>

            <p>Position: {application.position}</p>

            <p>Location: {application.location}</p>

            <p>Status: {application.status}</p>
             <button onClick={() => handleEdit(application)}>
  Edit
</button>
            <button onClick={() => handleDelete(application._id)}>
            Delete
            </button>
            <p>Notes: {application.notes}</p>

            <hr />
          </div>
        ))
      )}
    </div>
  );
}

export default App;