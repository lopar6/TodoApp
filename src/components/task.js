import {useState} from 'react'
import { useDrag } from 'react-dnd';

import { Trashbutton } from './trash-button';
import { PriorityButton } from './priority-button';
// priorty buton already included form todo component

export function Task(props) {
    const [title, setTitle]            = useState(props.title)
    const [priority, setPriority]      = useState(props.priority)
    const [showButtons, setButtonShow] = useState(null)  
  
  
    const [{isDragging, taskBeingDragged}, drag] = useDrag(() => ({
      type: 'Task',
      collect: (monitor, connect) => ({
        isDragging: !!monitor.isDragging(),
        // taskBeingDragged: connect.dragSource()
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