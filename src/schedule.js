import React, { useState } from 'react';
import 'firebase/auth';
import './css/style.css';
import 'react-calendar/dist/Calendar.css';
import { Calendar } from 'react-calendar';
import { TaskList } from './App.js';

export function SchedulePage(props) {
    let tasks = props.tasks;
    const [date, onChange] = useState(new Date());

    let dateString = date.toString().slice(0, 15);

    let currentTasks = [];
    if (tasks) {
        currentTasks = tasks.filter((task) => {
            let deadline = task.deadline.slice(0, 15);
            return deadline === dateString;
        })
    }

    return (
        <div className='content'>
            <p><em>'the most beautiful flower is one that blooms in adversity.'</em></p>
            <p>Select dates on the calendar to see what tasks are due on any given day.
            Click on a task to view and edit details.</p>
            <div className='row'>
                <div className='row'>
                    <div className='col d-flex'>
                        <Calendar
                            onChange={onChange}
                            showWeekNumbers
                            value={date}
                        />
                    </div>
                    <div className='col d-flex'>
                        <CurrentTaskCard tasks={currentTasks} isTaskList={true} date={date} />
                    </div>
                </div>
            </div>
        </div>
    )
}

function CurrentTaskCard(props) {
    let date = props.date.toString().slice(4, 10);
    let todayTasks = props.tasks;

    return (
        <div className='card mb-4'>
          <div className='card-header' role='navigation'>
              <h2 className='mb-4'>{date}</h2>
              <ul className='nav nav-tabs card-header-tabs'>
                <li className='nav-item'>
                    <a className={'nav-link active'} href='/#'>{'tasks'}</a>
                </li>
              </ul>
          </div>

          <div className={'card-body ' + date + '-list'}>
              <div className='row'>
                  <div className='col-sm'>
                      <TaskList tasks={todayTasks} isHomePage={false}/>
                  </div>
              </div>
          </div>
        </div>
      );
}
