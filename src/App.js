import './App.css'
import React, {useEffect, useState, useRef, Children} from 'react'
import { useDrag, DndProvider, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
// import { ItemTypes } from './Constants'


// todo move png to public
// todo check for first time visit and give them a little tour

function Task(props) {
  const [title, setTitle]            = React.useState(props.title)
  const [priority, setPriority]      = React.useState(props.priority)
  const [showButtons, setButtonShow] = React.useState(null)  


  const [{isDragging}, drag] = useDrag(() => ({
    type: 'Task',
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    })
  }))

  return ( 
    <div className={`task-box ${priority}-border`}
      // onClick={this.moveElement} 
      onMouseOver={() => setButtonShow(true)}
      onMouseLeave={() => setTimeout(() => setButtonShow(false), 500)}
      style={{opacity: isDragging ? 0.5 : 1, cursor: 'move'}}
      ref={drag}>
        <input type="text" 
               className={"title-display white-font"} 
               onChange={(event) => setTitle(event.target.value)} 
               value={title}/>
          {showButtons ? <div className="edit-buttons" >
            <Trashbutton removeTask={() => props.removeTask(props.keyValue)}/>
            <PriorityButton size={"small-button"} 
                            priority={priority} 
                            click={() => setPriority(cyclePriority(priority))}
                            />
          </div>: null}
      </div>
    )    
} 
  
  
function cyclePriority(priority) {
  if (priority == 'low')   {return 'medium'}
  if (priority == 'medium'){return 'high'}
  if (priority == 'high')  {return 'low'}    
}

// monitor.getItem() <- maybe use this to get task being handled

function TaskDropContainer(props) {
  const [, drop] = useDrop(
    () => ({
      accept: 'Task',
      // (drop spot value , dropee value )
      drop: () => props.moveTask(props.task.props.keyValue)
    })
  )
  return(
    <div ref={drop}>{props.task}</div>
  )
}

class Todo extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      //temp for testing
      //replace with api call
      taskDivs: [],
      newTaskTitle: '',
      newTaskPriority: 'low',
    } 
  }


  // dont need to bind method when using arrow functions
  // it helps Javascript understand the context
  addNewTask = (event) => {
    if(this.state.newTaskTitle && this.state.newTaskTitle != ''){
      // concat returns a new array with whatever was passed in added on
      // key needs to be completely unique and unchanging
      // todo replace _key with value from api
      let _key = Math.floor(Math.random()* 100000)
      let _previousTaskDivs = this.state.taskDivs.concat(
        <TaskDropContainer moveTask={this.moveTask}
                           task={<Task title={this.state.newTaskTitle} 
                           priority={this.state.newTaskPriority} 
                           removeTask={this.removeTask}
                           // key helps React identify individual components
                           // Without it React doesnt understand what component is what when array is mutated
                           key={_key}
                           keyValue={_key}/>}>
        </TaskDropContainer>
      )
      // why wont this work
      // let _previousTaskDivs = [<Task title={this.state.newTaskTitle} priority={this.state.newTaskPriority}/>].concat(this.state.taskDivs)
      this.setState({
        taskDivs: _previousTaskDivs,
        newTaskTitle: '',
        newTaskPriority: 'low',
      })
      //todo change values with API call
    }
  }

  //right now it just puts a new task at the end
  moveTask = (key) => {
    let newTaskDivs = this.state.taskDivs.concat(<Task title={this.state.newTaskTitle} 
                    priority={this.state.newTaskPriority} 
                    removeTask={this.removeTask}
              // key helps React identify individual components
              // Without it React doesnt understand what component is what when array is mutated
                    key={0}
                    keyValue={0}/>)
    this.setState({taskDivs: newTaskDivs})
  }

  // this could be more efficient
  removeTask = (key) => {
    let taskLocationInArray
    for(let i = 0; i < this.state.taskDivs.length; i++){
      if(this.state.taskDivs[i].key == key){
        taskLocationInArray = i
        //todo make sure i know this does what i think it does
        break
      }
    }

    let _tempTaskDivs = this.state.taskDivs.concat()
    _tempTaskDivs.splice(taskLocationInArray, 1)
    // need to update child taskID with new location in array
    // start from where we spliced
    this.setState({taskDivs: _tempTaskDivs})
  }
  
  changeNewTaskTitle = (event) => {
    this.setState({ newTaskTitle: event.target.value})
  }
  
  changeNewTaskPriority = () =>{
    if(this.state.newTaskPriority == 'low'){
      this.setState({newTaskPriority : 'medium'})
    }
    else if(this.state.newTaskPriority == 'medium'){
      this.setState({newTaskPriority : 'high'})    
    }
    else if(this.state.newTaskPriority == 'high'){
      this.setState({newTaskPriority : 'low'})    
    }
  }

  handleSubmission = (event) => {
    event.preventDefault()
    this.addNewTask(event)
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
                    removeTask={this.removeTask}>
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

            {this.state.taskDivs}
            <TaskDropContainer moveTask={this.moveTask}></TaskDropContainer>
          </div>
        </div>
      </DndProvider>
    )
  }
  
}
// props.priority ? props.priority : "low"
// todo make buttons pretty 
function PriorityButton(props){
  return( <input 
    type="button" 
    className={`input-button ${props.priority} ${props.size}`} 
    onClick={props.click}/>
    )
}

function Trashbutton({size = 'small-button', removeTask}){
  return <input type="button" className={`trash ${size}`} onClick={removeTask}></input>
}
  
  function App() {
    return (
      <div id="todo-container"><Todo/></div>
    );
  }
export default App;
