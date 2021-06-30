import React from 'react';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
// consider using this import update from 'immutability-helper';

import { Task } from './task.js'
import { PriorityButton } from './priority-button';

class TaskInitializer {
  constructor(_title, _priority, _key){
    this.title = _title
    this.priority = _priority
    this.key = _key
    this.index = 0
  }
}

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
        let task = new TaskInitializer(
          this.state.newTaskTitle,
          this.state.newTaskPriority,
          _key
        )
        let _newTasks = this.state.tasks.concat(task)
        this.setState({
          tasks: _newTasks,
          newTaskTitle: '',
          newTaskPriority: 'low',
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
  
    // this could be more efficient
    removeTask = (key) => {
      let taskLocationInArray
      for(let i = 0; i < this.state.tasks.length; i++){
        if(this.state.tasks[i].key === key){
          taskLocationInArray = i
          //todo make sure i know this does what i think it does
          break
        }
      }
  
      let _tempTasks = this.state.tasks.concat()
      _tempTasks.splice(taskLocationInArray, 1)
      // need to update child taskID with new location in array
      // start from where we spliced
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

    //todo implement this
    setPriority(index){
    }
  
    //todo implement this
    updateTitle(event, index){
      event.target.value()
    }
  
    render(){
      return(
        <DndProvider backend={HTML5Backend} >
          <div>
            <div id="new-todo-box">
              <form id="new-task-form"
                    onSubmit={this.handleSubmission}>
                <input type="text" 
                      id="new-task-title" 
                      placeholder="Enter a new task" 
                      onChange={this.changeNewTaskTitle} 
                      value={this.state.newTaskTitle} 
                      >
                </input>
                <div id="priority-buttons">
                    <PriorityButton priority={this.state.newTaskPriority} 
                                    click={this.changeNewTaskPriority}/>
                    <input type="button" 
                          className={`input-button submit`} 
                          value="save" 
                          onClick={this.addNewTask}>
                    </input>
                </div>
              </form>
            </div>
            <div className="task-box-container">
              {this.state.tasks.map((task, index)  => this.renderTask(task, index))}
            </div>
          </div>
        </DndProvider>
      )
    }
    
  }