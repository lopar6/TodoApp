import './App.css';
import ReactDOM from 'react-dom';
import React from 'react';
import reactDom from 'react-dom';


// todo check for first time visit and give them a little tour

class Task extends React.Component{
  constructor(props){
    super(props)
    this.state = { 
      title: props.title, 
      priority: props.priority,
      showButtons: null,
    }

    // needed to make 'this' work in callback
    // this is the old way of doing things before arrow functions were introduced (=>)
    this.changePriorityState = this.changePriorityState.bind(this);
    this.changeTitle         = this.changeTitle.bind(this);
    this.renderButtons       = this.renderButtons.bind(this);
    this.deRenderButtons     = this.deRenderButtons.bind(this);
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

  //todo ask Nate the best structure for deleting tasks
  render() {
    return ( 
      <div className={`task-box ${this.state.priority}-border`} onClick={this.moveElement} onMouseOver={this.renderButtons} onMouseLeave={this.deRenderButtons}>
        <input type="text" className={"title-display white-font"} onChange={this.changeTitle} value={this.state.title}/>
          {this.state.showButtons ? <div className="edit-buttons" >
            <Trashbutton/>
            <PriorityButton size={"small-button"} priority={this.state.priority} click={this.changePriorityState}/>
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
      _tempDivs.push(<Task title={`task ${i + 1}`} priority='low' />)
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
      let _previousTaskDivs = this.state.taskDivs.concat(<Task title={this.state.newTaskTitle} priority={this.state.newTaskPriority}/>)
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

  removeTask = () => {
    let _tempTaskDivs = this.state.taskDivs;
    // _tempTaskDivs.
    // this.setState(taskDivs:)
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
  
  render(){
    return(
      <div>
        <div id="new-todo-box">
          <form id="new-task-form">
            <input type="text" id="new-task-title" placeholder="Enter a new task" onChange={this.changeNewTaskTitle} value={this.state.newTaskTitle}>
            </input>
            <div id="priority-buttons">
                <PriorityButton priority={this.state.newTaskPriority} click={this.changeNewTaskPriority}/>
                <input type="button" className={`input-button submit`} value="save" onClick={this.addNewTask}></input>
            </div>
          </form>
        </div>
        {this.state.taskDivs}
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

function Trashbutton({size = 'small-button', click}){
  return <input type="button" className={`trash ${size}`} onClick={click}></input>
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
