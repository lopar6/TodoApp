import React from 'react';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { motion } from "framer-motion"
import axios from 'axios';
// consider using this import update from 'immutability-helper';

import { Task } from './task.js'
import { PriorityButton } from './priority-button';
import { cyclePriority } from '../services/cycle-priority';
import { intToPriority } from '../services/intToPriority';

// example of what a task looks like
// task {
//   index: 0,
//   pk: 0,
//   priority: 1,
//   title: ""
// }

const APIurl = "http://localhost:8000/"


//todo button hover feels off
//todo consider adding useCallback to improve performance
export class Todo extends React.Component{
    constructor(props){
      super(props)
      this.state = {
        //temp for testing
        //replace with api call
        tasks: [],
        newTaskTitle: '',
        newTaskPriority: 1,
      } 
    }
  

    getTasks = () => {
      axios.get(APIurl + "tasks/")
      .then((res) => {
        res.data.sort((a, b) => {return a.index - b.index})
        this.setState({tasks: res.data})
      })
    }

    // todo add error handling
    updateTasksOnAPI = (tasks = this.state.tasks) => {
      // update index values for all tasks
      return axios({
        method: 'post',
        url: APIurl + 'tasks/batch/',
        data: tasks,
      })
    }
    
    // dont need to bind method when using arrow functions
    // it helps Javascript understand the context
    addNewTask = (event) => {
      if(this.state.newTaskTitle && this.state.newTaskTitle !== ''){
        // concat returns a new array with whatever was passed in added on
        // key needs to be completely unique and unchanging
        let task = [{
          index: 0,
          title: this.state.newTaskTitle,
          priority: this.state.newTaskPriority,
          pk: null
        }]
        let _newTasks = task.concat(this.state.tasks)
        // update the index for each task
        for(let i = 1; i < _newTasks.length; i++){
          _newTasks[i].index = i
        }
        this.setState({
          tasks: _newTasks,
          newTaskTitle: ''
        })
        // update API
        // !this could be buggy and may need refactoring
        this.updateTasksOnAPI(_newTasks).then((response) => { 
          // loop through response data finding task at index 0, and local task with null pk value
          // update local pk value 
          let resposeDataIndex = null
          let localTaskIndex = null
          for(let i = 0; i < response.data.length; i++){
            if (response.data[i].index === 0){
              resposeDataIndex = i 
            }
            if (_newTasks[i].pk === null){
              localTaskIndex = i
            }
          }
          _newTasks[localTaskIndex].pk = response.data[resposeDataIndex].pk
          this.setState({
            tasks: _newTasks,
          })
          
        })
      }
    }

    
    //todo add logic to change location of Tasks in state.tasks
    moveTask = (dragIndex, dropIndex) => {
      let _tempTasks = [...this.state.tasks]
      const draggedTask = _tempTasks[dragIndex]
      // delete dragged task
      _tempTasks.splice(dragIndex, 1)
      // add dragged task back in 
      _tempTasks.splice(dropIndex, 0, draggedTask)
      
      // set each index to proper location in array
      for(let i = 0; i < _tempTasks.length; i++){
        _tempTasks[i].index = i
      }

      this.setState({tasks: _tempTasks})
    }
    
    // remove task from list, also triggers API update
    removeTask = (index, pk) => {
      let _tempTasks = [...this.state.tasks]
      _tempTasks.splice(index, 1)
      this.setState({tasks: _tempTasks})
      this.deleteTaskFromAPI(pk)
    }

    deleteTaskFromAPI = (taskpk) => {
      axios.delete(APIurl + `tasks/${taskpk}/`)
        .then((response) => {
          console.log(response)
        })
        .then(this.updateTasksOnAPI())
    } 
    
    changeNewTaskTitle = (event) => {
      this.setState({ newTaskTitle: event.target.value})
    }
    
    changeNewTaskPriority = () =>{
      this.setState({newTaskPriority: cyclePriority(this.state.newTaskPriority)})
    }
  
    handleSubmission = (event) => {
      event.preventDefault()
      this.addNewTask(event)
    }

    setPriority = (index) => {
      let _tempTasks = [...this.state.tasks]
      _tempTasks[index].priority = cyclePriority(_tempTasks[index].priority)
      this.setState({tasks: _tempTasks})

      // update value of this one task on API
      axios({
        method: 'patch',
        url: APIurl + `tasks/${this.state.tasks[index].pk}/`,
        data: this.state.tasks[index],
      })
      // axios.patch(APIurl + `tasks/${this.state.tasks[index].pk}/`, this.state.tasks[index])
    }
  
    updateTitle = (event, index) => {
      let _tempTasks = [...this.state.tasks]
      _tempTasks[index].title = event.target.value
      this.setState({tasks: _tempTasks})
    }

    renderTask = (task) => {
      // task.index = index
      return(
        <Task 
          //key value not accessable to components
          //key does not coorelate with actual database key value
          key={task.pk}
          pk={task.pk}
          index={task.index}
          title={task.title}
          priority={task.priority}
          removeTask={this.removeTask}
          moveTask={this.moveTask}
          updateTitle={this.updateTitle}
          setPriority={this.setPriority}
          updateAPI={this.updateTasksOnAPI}
        />
      )
    }

    // only get tasks from API when first loading the page
    shouldRequest = true
    render = () => {
      if (this.shouldRequest){
        this.shouldRequest = false
        this.getTasks()
      }

      return(
        <DndProvider backend={HTML5Backend} >
          <motion.div
            id={"todo-container"}
            layout={true}
            animate={{ pathLength: 1 }}
            transition={{ type:'spring', bounce: .15, duration: .6, ease:"easeOut"}}
            >
            <div id="new-todo-box">
              <form 
                id="new-task-form"
                onSubmit={this.handleSubmission}>
                <input 
                  type="text" 
                  id="new-task-title" 
                  placeholder="Enter a new task" 
                  onChange={this.changeNewTaskTitle} 
                  value={this.state.newTaskTitle}
                  >
                </input>
                <div id="priority-buttons">
                    <PriorityButton 
                      priority={intToPriority(this.state.newTaskPriority)} 
                      click={this.changeNewTaskPriority}/>
                    <input 
                      type="button" 
                      className={`input-button submit`} 
                      value="save" 
                      onClick={this.addNewTask}
                      >
                    </input>
                </div>
              </form>
            </div>
            <motion.div 
              layout={true} 
              transition={{ type: 'spring', duration: .6 }}
              className="task-box-container">
                {this.state.tasks.map((task, index)  => this.renderTask(task, index))}
            </motion.div>
          </motion.div>
        </DndProvider>
        )
      }
    }
  