import './App.css';

// todo check for first time visit and give them a little tour

class Task {
  constructor(title = '', priority = 'low'){
      this.title = title;
      this.priority = priority;
  }
}
// todo make buttons pretty 
// todo make buttons only appear when hovering
function Trashbutton({size = 'small-button'}){
  return <input type="button" className={`trash ${size}`}></input>
}

function EditButton({size = 'small-button'}){
  return <input type="button" className={`edit ${size}`}></input>
}

// todo add cycle through colors mechanic
function PriorityButton({size = ''}){
  return <input type="button" className={`input-button low ${size}`}/>
}

function SubmitButton({size = ''}){
  return <input type="button" className={`input-button submit ${size}`} value="save"></input>
}

function TaskDiv({priortiy = 'low', title = 'task'}){
  return <div className={`task-box ${priortiy}-border`}>
              <div className={"title-display"}>{title}</div>
              <div className="edit-buttons">
                  <Trashbutton/>
                  <PriorityButton size={"small-button"}/>
                  <EditButton/>
              </div>
          </div>
}

function NewTodoBox(){
  return <div id="new-todo-box"><NewTaskForm/></div>
}



function NewTaskForm({children}){
  return <form id="new-task-form">
      <input type="text" id="new-task-title" placeholder="Enter a new task"></input>
      <div id="priority-buttons">
          <PriorityButton/>
          <SubmitButton/>
       </div>

  </form>
}

function Todo({taskList}){
  let taskDivs = []
  taskDivs.push(<NewTodoBox/>)
  if (taskList) {
      for(let i=0; i < taskList.length; i++){
          taskDivs.push(<TaskDiv priortiy={taskList[i].priority} title={taskList[i].title}></TaskDiv>)
      } 
      return taskDivs
  }
  else{
      return <div>No tasks!</div>
  }
}

let taskList = []
//test
for(let i = 0; i < 5; i++){
  taskList[i] = new Task(`task ${i + 1}`, 'medium')
  if (i % 2 === 0){
      taskList[i] = new Task(`task ${i + 1}`, 'low')
  }
}
taskList[5] = new Task(`task ${6}`, 'high');

function App() {
  return (
    <div id="todo-container"><Todo taskList={taskList}/></div>
  );
}

export default App;
