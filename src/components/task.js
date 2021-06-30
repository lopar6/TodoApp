import { useState, useRef, useEffect, useContext } from 'react'
import { useDrag, useDrop } from 'react-dnd';

import { Trashbutton } from './trash-button';
import { PriorityButton } from './priority-button';
import { cyclePriority } from '../services/cycle-priority';

export function Task(props) {
    const [title, setTitle]            = useState(props.title)
    const [priority, setPriority]      = useState(props.priority)
    const [showButtons, setButtonShow] = useState(null)  
    const dropRef                      = useRef(null)
    const [index, setIndex]            = useState(props.index)
    
    useEffect(() => {
      setIndex(index)
      setPriority(priority)
      setTitle(title)
      console.log(index, title, props.index)
    }, [index, title, priority, props])

    const [{isDragging}, drag] = useDrag(() => ({
      type: 'Task',
      item: {index},
      dropEffect: "move",
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging()
      })
    }))
  

    const [, drop, monitor] = useDrop(
      () => ({
        accept: 'Task',
        //todo add hover moving mechanics
        hover: (item) => {
          // const dragKey = item.index
          // const dropKey = index
        },
        drop: (item) => {
          // Determine rectangle on screen
          // if the reference to the drop DOM object does not exist
          // do not continue
          const dragIndex = item.index
          const dropIndex = index
          console.log("drag", dragIndex, "drop", dropIndex)
          // dont replace items with themselves
          if (dragIndex === dropIndex) {return}
          props.moveTask(dragIndex, dropIndex)
          

        //todo finish this logic

        if (!dropRef.current) {return}
        // find rectangle location of div
        // const boundingRect = dropRef.current.getBoundingClientRect()
        // const middleY = (boundingRect.bottom - boundingRect.top) / 2
        // get mouse position
        const mouseOffest = monitor.getClientOffset()


        //todo add logic to make sure tasks are moved to the correct place (above or below halfway)
        }
      })
    )


    return ( 
      <div ref={drop}>
        {/* {console.log(title, props.index, "has rendered")} */}
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
      </div>
      )    
  } 
