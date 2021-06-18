class Task {
    constructor(title = '', priority = 'low'){
        this.title = title;
        this.priority = priority;
    }
}

function TaskDiv({priortiy = 'low', title = 'task'}){
    return <div className={`task-box ${priortiy}-priority`}>{title}</div>
}

function Todo({taskList}){
    if (taskList) {
        let taskDivs = []
        for(let i=0; i < taskList.length; i++){
            taskDivs.push(<TaskDiv priortiy={taskList[i].priority} title={taskList[i].title}></TaskDiv>)
        } 
        return taskDivs
    }
    else{
        return <div>No tasks!</div>
    }
}

function TodoWrapper({ divId = 'todo-container', taskList = []}){
    return <div id={divId}><Todo taskList={taskList}></Todo></div> 
}

let taskList = []
//test
for(let i = 0; i < 5; i++){
    taskList[i] = new Task(`task ${i + 1}`, 'medium')
    if (i % 2 == 0){
        taskList[i] = new Task(`task ${i+1}`, 'low')
    }
}
taskList[5] = new Task(`task ${6}`, 'high')

const rootElement = document.getElementById('root')
const todoElement =  <TodoWrapper taskList={taskList}></TodoWrapper>   
ReactDOM.render(todoElement, rootElement)