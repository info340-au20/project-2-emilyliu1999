import React, { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import { Formik, Field, Form, ErrorMessage, useFormikContext } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import { Redirect, useParams } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';

// React component for the detailed page view of a task
export function TaskDetailsPage(props) {
  const [currentTask, setCurrentTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRedirect, setIsRedirect] = useState(false);

  const { taskKey } = useParams();
  const queryString = props.user.displayName + '/tasks/' + taskKey;

  const redirectTo = () => {
    if (taskKey === 'new') {
      return <Redirect push exact to='/' />;
    } else {
      return <Redirect push to='/schedule' />;
    }
  };

  const addNewTask = (taskKey, task) => {
    if (taskKey === 'new') {
      firebase.database().ref(props.user.displayName + '/tasks').push(task);  // push a new task
    } else {
      firebase.database().ref(queryString).set(task); // overwrite specifically the existing task
    }
  };

  const DatePickerField = ({ name }) => {
    const formik = useFormikContext();
    const field = formik.getFieldProps(name);

    return (
      <DatePicker
        name={field.name}
        value={field.value}
        autoComplete={"off"}
        selected={(field.value && new Date(field.value)) || null}
        onChange={value => formik.setFieldValue(name, value)}
      />
    );
  }

  useEffect(() => { // if not creating a new task, check if the task exists
    const queryRef = firebase.database().ref(queryString);
    queryRef.once('value', function(snapshot) {
      if (taskKey !== 'new') {
        if (snapshot.val()) {
          setCurrentTask(snapshot.val());
        }
      }
    }).then(() => setIsLoading(false));

    return function cleanup() {
      queryRef.off();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // if there has just been a change, redirect to the home page
  if (isRedirect) {
    return redirectTo();
  }

  if (isLoading) {
    return (
      <div className='spinner'>
        <i className='fa fa-spinner fa-spin fa-3x' aria-label='Loading...'></i>
      </div>
    );
  }

  // error message for when the task is not found in the database
  if (taskKey !== 'new' && !currentTask) {
    return (
      <h2>Task not found.</h2>
    );
  }

  return (
    <>
      <Formik
         initialValues={{
           taskName: (currentTask ? currentTask.name : ''),
           taskDescription: (currentTask ? currentTask.desc : ''),
           deadline: (currentTask ? new Date(currentTask.deadline) : ''),
           complete: (currentTask ? currentTask.complete : false)
         }}
         validationSchema={Yup.object({
           taskName: Yup.string()
             .required('*Required*'),
           taskDescription: Yup.string()
             .required('*Required*'),
           deadline: Yup.string().required('*Required*'),
           complete: Yup.string()
         })}
         onSubmit={(values, { setSubmitting }) => {
           setTimeout(() => {
             let newTaskObj = {name: values.taskName, desc: values.taskDescription, deadline: values.deadline.toString(), complete: values.complete};
             addNewTask(taskKey, newTaskObj);
             setIsRedirect(true);
             setSubmitting(false);
           }, 400);
         }}
      >

      <Form>
        <label htmlFor='taskName'>Task Name</label>
        <Field name='taskName' type='text' autoComplete="off" />
        <ErrorMessage name='taskName' />

        <label htmlFor='taskDescription'>Task Description</label>
        <Field name='taskDescription' as='textarea' autoComplete="off" />
        <ErrorMessage name='taskDescription' />

        <label htmlFor='deadline'>Deadline</label>
        <DatePickerField name='deadline' />
        <ErrorMessage name='deadline' />

        <label htmlFor='complete'>Is this task completed?</label>
        <Field name='complete' type='checkbox' />
        <ErrorMessage name='complete' />

        <button type='submit'>save</button>
        <button type='button' onClick={() => {
          setIsRedirect(true);
        }}>cancel</button>
      </Form>
    </Formik>
   </>
  );
};

export default TaskDetailsPage;
