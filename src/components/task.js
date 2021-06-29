import {useState} from 'react'
import { useDrag } from 'react-dnd';

import { Trashbutton } from './trash-button';
import { PriorityButton } from './priority-button';
import { cyclePriority } from '../services/cycle-priority';

export function Task(props) {
    const [title, setTitle]            = useState(props.title)
    const [priority, setPriority]      = useState(props.priority)
    const [showButtons, setButtonShow] = useState(null)  
    
    const index = props.index
    const [{isDragging}, drag] = useDrag(() => ({
      type: 'Task',
      item: {type : 'Task', index},
      dropEffect: "move",
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging()
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
              <Trashbutton removeTask={() => props.removeTask(props.index)}/>
              <PriorityButton size={"small-button"} 
                              priority={priority} 
                              click={() => setPriority(cyclePriority(priority))}
                              />
            </div>: null}
        </div>
      )    
  } 
