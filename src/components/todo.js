import React from 'react';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { motion } from "framer-motion"
// consider using this import update from 'immutability-helper';

import { Task } from './task.js'
import { PriorityButton } from './priority-button';
import { cyclePriority } from '../services/cycle-priority';

class TaskInitializer {
  constructor(_title, _priority, _key){
    this.title = _title
    this.priority = _priority
    this.key = _key
    this.index = 0
  }
}

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
        newTaskPriority: 'low',
      } 
    }
  
    // dont need to bind method when using arrow functions
    // it helps Javascript understand the context
    addNewTask = (event) => {
      if(this.state.newTaskTitle && this.state.newTaskTitle !== ''){
        // concat returns a new array with whatever was passed in added on
        // key needs to be completely unique and unchanging
        // todo replace _key with value from api
        let _key = Math.floor(Math.random()* 100000)
        let task = [new TaskInitializer(
          this.state.newTaskTitle,
          this.state.newTaskPriority,
          _key
        )]
        let _newTasks = task.concat(this.state.tasks)
        this.setState({
          tasks: _newTasks,
          newTaskTitle: ''
        })
        //todo change values with API call
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

      this.setState({tasks: _tempTasks})
    }
  
    removeTask = (index) => {
      let _tempTasks = [...this.state.tasks]
      _tempTasks.splice(index, 1)
      this.setState({tasks: _tempTasks})
    }
    
    changeNewTaskTitle = (event) => {
      this.setState({ newTaskTitle: event.target.value})
    }
    
    changeNewTaskPriority = () =>{
      if(this.state.newTaskPriority === 'low'){
        this.setState({newTaskPriority : 'medium'})
      }
      else if(this.state.newTaskPriority === 'medium'){
        this.setState({newTaskPriority : 'high'})    
      }
      else if(this.state.newTaskPriority === 'high'){
        this.setState({newTaskPriority : 'low'})    
      }
    }
  
    handleSubmission = (event) => {
      event.preventDefault()
      this.addNewTask(event)
    }

    setPriority = (index) => {
      let _tempTasks = [...this.state.tasks]
      _tempTasks[index].priority = cyclePriority(_tempTasks[index].priority)
      this.setState({tasks: _tempTasks})
    }
  
    updateTitle = (event, index) => {
      let _tempTasks = [...this.state.tasks]
      _tempTasks[index].title = event.target.value
      this.setState({tasks: _tempTasks})
    }
    
    renderTask(task, index){
      task.index = index
      return(
        <Task 
        //key value not accessable to components
        //key does not coorelate with actual database key value
        key={task.key}
        index={index}
        title={task.title}
        priority={task.priority}
        removeTask={this.removeTask}
        moveTask={this.moveTask}
        updateTitle={this.updateTitle}
        setPriority={this.setPriority}
        />
      )
    }

    render(){
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
                      priority={this.state.newTaskPriority} 
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