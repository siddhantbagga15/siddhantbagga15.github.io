import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";

export default function Edit() {
  const [form, setForm] = useState({
    courseName: "",
    instructor: "",
    difficulty: "",
    records: [],
  });
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const id = params.id.toString();
      const response = await fetch(`http://localhost:5000/record/${params.id.toString()}`);

      if (!response.ok) {
        const message = `An error has occured: ${response.statusText}`;
        window.alert(message);
        return;
      }

      const record = await response.json();
      if (!record) {
        window.alert(`Record with id ${id} not found`);
        navigate("/");
        return;
      }

      setForm(record);
    }

    fetchData();

    return;
  }, [params.id, navigate]);

  // These methods will update the state properties.
  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  async function onSubmit(e) {
    e.preventDefault();
    const editedCourse = {
      courseName: form.courseName,
      instructor: form.instructor,
      difficulty: form.difficulty,
    };


    // This will send a post request to update the data in the database.
    await fetch(`http://localhost:5000/update/${params.id}`, {
      method: "POST",
      body: JSON.stringify(editedCourse),
      headers: {
        'Content-Type': 'application/json'
      },
    });

    navigate("/");
  }

  // This following section will display the form that takes input from the user to update the data.
  return (
    <div>
      <h3>Update Course</h3>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="name">Course Name: </label>
          <input
            type="text"
            className="form-control"
            id="courseName"
            value={form.courseName}
            onChange={(e) => updateForm({ courseName: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="instructor">Instructor: </label>
          <input
            type="text"
            className="form-control"
            id="instructor"
            value={form.instructor}
            onChange={(e) => updateForm({ instructor: e.target.value })}
          />
        </div>
        <div className="form-group">
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="difficultyOptions"
              id="difficultyEasy"
              value="Easy"
              checked={form.difficulty === "Easy"}
              onChange={(e) => updateForm({ difficulty: e.target.value })}
            />
            <label htmlFor="difficultyEasy" className="form-check-label">Easy</label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="difficultyOptions"
              id="difficultyMedium"
              value="Medium"
              checked={form.difficulty === "Medium"}
              onChange={(e) => updateForm({ difficulty: e.target.value })}
            />
            <label htmlFor="difficultyMedium" className="form-check-label">Medium</label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="difficultyOptions"
              id="difficultyHard"
              value="Hard"
              checked={form.difficulty === "Hard"}
              onChange={(e) => updateForm({ difficulty: e.target.value })}
            />
            <label htmlFor="difficultyHard" className="form-check-label">Hard</label>
        </div>
        </div>
        <br />

        <div className="form-group">
          <input
            type="submit"
            value="Update Course"
            className="btn btn-primary"
          />
        </div>
      </form>
    </div>
  );
}
