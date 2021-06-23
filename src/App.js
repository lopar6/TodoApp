import './App.css'
import React, {useState} from 'react'
import { useDrag } from 'react-dnd'
// import { ItemTypes } from './Constants'

// todo move png to public
// todo check for first time visit and give them a little tour

function Task(props) {
  const [title, changeTitle]         = React.useState(props.title)
  const [priority, changePriority]   = React.useState(props.priority)
  const [taskID]                     = React.useState(props.taskID)
  const [showButtons, setButtonShow] = React.useState(null)  

  

  return ( 
    <div className={`task-box ${priority}-border`}
      // onClick={this.moveElement} 
      onMouseOver={() => setButtonShow(true)}
      onMouseLeave={() => setTimeout(() => setButtonShow(false), 500)}>
        <input type="text" 
               className={"title-display white-font"} 
               onChange={(event) => changeTitle(event.target.value)} 
               value={title}/>
          {showButtons ? <div className="edit-buttons" >
            <Trashbutton removeTask={() => props.removeTask(taskID)}/>
            <PriorityButton size={"small-button"} 
                            priority={priority} 
                            click={() => changePriority(cyclePriority(priority))}
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


class Todo extends React.Component{
  constructor(props){
    super(props)
    let _tempDivs = []
    for(let i=0; i < 5; i++){
      _tempDivs.push(<Task title={`task ${i + 1}`} 
      priority='low' 
      taskID={i} 
      removeTask={this.removeTask}/>)
    }
    this.state = {
      //temp for testing
      //replace with api call
      taskDivs: _tempDivs,
      newTaskTitle: '',
      newTaskPriority: 'low',
    } 
  }
  
  // dont need to bind method when using arrow functions
  // it helps Javascript understand the context
  addNewTask = (event) => {
    if(this.state.newTaskTitle && this.state.newTaskTitle != ''){
      // concat returns a new array with whatever was passed in added on
      let _previousTaskDivs = this.state.taskDivs.concat(<Task title={this.state.newTaskTitle} 
                                                               priority={this.state.newTaskPriority} 
                                                               taskID={this.state.taskDivs.length}
                                                               removeTask={this.removeTask}/>)
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

  removeTask = (taskID) => {
    let _tempTaskDivs = this.state.taskDivs.concat()
    _tempTaskDivs.splice(taskID, 1)
    // need to update child taskID with new location in array
    // start from where we spliced
    for(let i = taskID; i <  _tempTaskDivs.length; i++){
      // update taskID values to reflect new location in array
      
      _tempTaskDivs[i] = React.cloneElement( _tempTaskDivs[i], {taskID: i})
    }
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

  //this doesnt work with class components
  // // draggableTask(){
  // //   const [{ isDragging, drag}] = useDrag(() => ({
  // //     type: Task,
  // //     collect: monitor => ({
  // //       isDragging: !!monitor.isDragging(),
  // //     })
  // //   }))
  // // }

  render(){
    return(
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
        </div>
      </div>
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
