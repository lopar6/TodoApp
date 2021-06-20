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
      priority: props.priority
    }
    // needed to make 'this' work in callback
    this.changePriorityState = this.changePriorityState.bind(this);
    this.changeTitle = this.changeTitle.bind(this);
  }

  // take in Task object, change priority
  // todo fix currently renders whole app, only render this one element
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

  render() {
    return ( 
        //todo change the 'onChange' to something that exicutes after user is done for more effdeciency
      <div className={`task-box ${this.state.priority}-border`} onClick={this.moveElement} >
        <input type="text" className={"title-display"} onChange={this.changeTitle} value={this.state.title}/>
          <div className="edit-buttons" >
            <PriorityButton size={"small-button"} priority={this.state.priority} click={this.changePriorityState}/>
            <Trashbutton/>
          </div>
      </div>
    )
  }
}

class PriorityButton extends React.Component{
  constructor(props){
    super(props)
    this.state = { 
      priority: props.priority
    }
    this.click = props.click
    this.size = props.size
    this.changePriorityState = this.changePriorityState.bind(this);
  }
  
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
  
  render(){
    return( <input 
      type="button" 
      className={`input-button ${this.state.priority ? this.state.priority : "low"} ${this.size}`} 
      // todo ask Nate why I cant move this.click into another function
      onClick={this.click ? this.click : this.changePriorityState}/>
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
      taskDivs: _tempDivs
    } 
    this.addNewTask = this.addNewTask.bind(this)
  }
  
  addNewTask(event){
    // concat returns a new array with whatever was passed in added on
    let _previousTaskDivs = this.state.taskDivs.concat(<Task title="new task" priority='low'/>)
    this.setState({taskDivs: _previousTaskDivs})
    //todo change value with API call
  }

  render(){
    return(
      <div>
        <div id="new-todo-box">
          <form id="new-task-form">
            <input type="text" id="new-task-title" placeholder="Enter a new task">
            </input>
            <div id="priority-buttons">
                <PriorityButton priority={'low'}/>
                <input type="button" className={`input-button submit`} value="save" onClick={this.addNewTask}></input>
            </div>
          </form>
        </div>
        {this.state.taskDivs}
      </div>
    )
  }
  
}

// todo make buttons pretty 
// todo make buttons only appear when hovering
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
