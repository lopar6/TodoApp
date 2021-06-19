import './App.css';
import ReactDOM from 'react-dom';
import React from 'react';


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

  render() {
    return ( 
      <div className={`task-box ${this.state.priority}-border`} >
        <div className={"title-display"}>
          {this.state.title}
        </div>
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
      _tempDivs.push(<Task title={`task ${i}`} priority='low' />)
    }
    this.state = {
      //temp for testing
      //replace with api call
      taskDivs: _tempDivs
    } 
  }
  

  render(){
    return(
      <div>
      <NewTodoBox></NewTodoBox>
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

function EditButton({size = 'small-button'}){
  return <input type="button" className={`edit ${size}`}></input>
}

// todo add cycle through colors mechanic

function SubmitButton({size = ''}){
  return <input type="button" className={`input-button submit ${size}`} value="save"></input>
}

function NewTodoBox(){
  return <div id="new-todo-box"><NewTaskForm/></div>
}

function NewTaskForm({children}){
  return <form id="new-task-form">
      <input type="text" id="new-task-title" placeholder="Enter a new task"></input>
      <div id="priority-buttons">
          <PriorityButton priority={'low'}/>
          <SubmitButton/>
       </div>

  </form>
}
  
  function App() {
    return (
      <div id="todo-container"><Todo/></div>
    );
  }
export default App;
