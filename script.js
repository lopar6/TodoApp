class Task {
    constructor(title = '', priority = ''){
        this.title = title;
        this.priority = priority;
    }
}


function Todo({taskList}){
    if (taskList) {
        return <div>{taskList[0].title}</div>
    }
    else{
        return <div>No tasks!</div>
    }
}

let taskList = ["j"]
//test
for(let i = 0; i < 5; i++){
    taskList[i] = new Task(`task ${i + 1}`, 'low')
}

const rootElement = document.getElementById('root')
const todoElement =  <Todo taskList={taskList}></Todo>   
ReactDOM.render(todoElement, rootElement)