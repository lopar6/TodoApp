import './App.css'
import React from 'react'
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd'
import reactDom from 'react-dom'

// todo move png to public
// todo check for first time visit and give them a little tour

class Task extends React.Component{
  constructor(props){
    super(props)
    this.state = { 
      title: props.title, 
      priority: props.priority,
      showButtons: null,
      taskID : props.taskID
    }

    // needed to make 'this' work in callback
    // this is the old way of doing things before arrow functions were introduced (=>)
    this.changePriorityState = this.changePriorityState.bind(this);
    this.changeTitle         = this.changeTitle.bind(this);
    this.renderButtons       = this.renderButtons.bind(this);
    this.deRenderButtons     = this.deRenderButtons.bind(this);
  }

  // todo update this, is depricated
  componentWillReceiveProps({title, taskID, priority}){
    this.setState({
      title: title,
      taskID: taskID,
      priority: priority,
      // may need to add ref to this
    })
  }

  // take in Task object, change priority
  // todo find a way to avoid repeating this
  changePriorityState() {
    if(this.state.priority == 'low'){
      this.setState({priority : 'medium'})
    }
    if(this.state.priority == 'medium'){
      this.setState({priority : 'high'})    
    }
    if(this.state.priority == 'high'){
      this.setState({priority : 'low'})    
    }
  } 

  changeTitle(event){
    //todo change title of task with API call
    //todo update state of title
    
    this.setState({title: event.target.value})
  }

  moveElement(){
    // move self to another place on list
  }

  renderButtons(){
    this.setState({showButtons: true})
  }
  
  deRenderButtons(){
    setTimeout(() => this.setState({showButtons: false}), 500)
  }

  removeSelf = () => {
    this.props.removeTask(this.state.taskID)
  }

  

  //todo ask Nate the best structure for deleting tasks
  render() {
    return ( 
      <div className={`task-box ${this.state.priority}-border`} 
           onClick={this.moveElement} 
           onMouseOver={this.renderButtons} 
           onMouseLeave={this.deRenderButtons}
           ref={this.props.innerRef}>
        <input type="text" 
               className={"title-display white-font"} 
               onChange={this.changeTitle} 
               value={this.state.title}/>
          {this.state.showButtons ? <div className="edit-buttons" >
            <Trashbutton removeTask={this.removeSelf}/>
            <PriorityButton size={"small-button"} 
                            priority={this.state.priority} 
                            click={this.changePriorityState}/>
          </div>: null}
      </div>
    )
  }
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
        <DragDropContext>
          <Droppable droppableId="task-box-container">
            {(provided) => (<div className="task-box-container" 
                                {...provided.droppableProps} 
                                ref={provided.innerRef}>{this.state.taskDivs.map((task, index) => {
                                  return (
                                    // may need to make this state and not props
                                    <Draggable key={task.props.taskID} draggableId={toString(task.props.taskID)} index={index}>
                                      {(provided) => <Task {...task.props}{...provided.draggableProps} {...provided.dragHandleProps} innerRef={provided.innerRef} ></Task>}
                                      {/* {(provided) => React.cloneElement(task, {...provided.draggableProps, 
                                                                                ref : provided.innerRef, 
                                                                                ...provided.dragHandleProps})} */}
                                    </Draggable>
                                  ) 
                                }
                              )}
                            </div>)}
          </Droppable>
        </DragDropContext>
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

function NewTaskForm({saveButtonCall}){
  return <form id="new-task-form">
      <input type="text" id="new-task-title" placeholder="Enter a new task"></input>
      <div id="priority-buttons">
          <PriorityButton priority={'low'}/>
          <input type="button" className={`input-button submit`} value="save" onClick={saveButtonCall}></input>
       </div>

  </form>
}
  
  function App() {
    return (
      <div id="todo-container"><Todo/></div>
    );
  }
export default App;
