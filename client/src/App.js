import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import './index.css';

const App = () => {
  const [teams, setTeams] = useState([]);
  const [response, setResponse] = useState({});

  useEffect(() => {
    axios.get('http://localhost:8000/teams').then((res) => {
      setTeams(res.data);
    });
  }, []);

  const validationSchema = Yup.object({
    task: Yup.string().required('Task is required'),
    teams: Yup.array().min(1, 'Select at least one team'),
  });

  const initialValues = {
    task: '',
    teams: [],
  };

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      const tasks = values;

      let res = await axios.post('http://localhost:8000/assign-task', tasks);
      setResponse(res.data);
      resetForm();
    } catch (error) {
      console.error('Error assigning tasks:', error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form>
          <div>
            <label>Task:</label>
            <Field as="textarea" name="task" />
            <ErrorMessage name="task" component="div" className="error" />
          </div>
          <div>
            <label>Teams:</label>
            <Field as="select" name="teams" multiple>
              {teams.map((team) => (
                <option key={team} value={team}>
                  {team}
                </option>
              ))}
            </Field>
            <ErrorMessage name="teams" component="div" className="error" />
          </div>
          <button type="submit">Assign Tasks</button>
        </Form>
      </Formik>
      {response && (
        <div className="response">
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default App;
