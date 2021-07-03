import { useState, useRef, useEffect } from 'react'
import { useDrag, useDrop } from 'react-dnd';
import { motion } from "framer-motion"

import { Trashbutton } from './trash-button';
import { PriorityButton } from './priority-button';
import { intToPriority } from '../services/intToPriority';

export function Task({index, pk, title, priority, removeTask, moveTask, updateTitle, setPriority, updateAPI}) {
  const [showButtons, setButtonShow] = useState(null)  
  const ref = useRef(null)
  
  // make sure react recognizes updates to these values when rendering
  useEffect(() => {
  }, [index, title, priority, index])

  const [{isDragging}, drag] = useDrag(({
    type: 'Task',
    item: () => {
      return {index}
    },
    collect: (monitor) => {

      return {
        isDragging: !!monitor.isDragging(),
        // todo change this to only passing index
      }
    },
    dropEffect: "move",
  }))

  const [{handlerId}, drop] = useDrop ({
    accept: 'Task',
    collect: (monitor) => {
      // isDragging: !!monitor.isDragging(),
      return {
        handlerId: monitor.getHandlerId()
      }
    },

    // when item is dropped, make API call to update index position in DB
    drop: (item) => {
      // do not replace items with self
      if (index.item === index ){return}
      updateAPI()
    },

    hover: (item, monitor) => {
      // if the reference to the drop DOM object does not exist
      // do not continue
      const dragIndex = item.index
      const dropIndex = index
      // dont replace items with themselves
      if (dragIndex === dropIndex) {return}
      if (!ref.current) {return}
      // find rectangle location of div
      const boundingRect = ref.current?.getBoundingClientRect()
      // middle of rectangle
      const middle = (boundingRect.bottom - boundingRect.top) / 2
      // get mouse position
      const mouseOffset = monitor.getClientOffset().y -boundingRect.top
      //if moving down, only activate when below half of component
      if (dragIndex < dropIndex && mouseOffset < middle){
        return
      }
      // if moving up, only activate when above half of component
      if (dragIndex > dropIndex && mouseOffset > middle){
        return
      }
      moveTask(dragIndex, dropIndex)
      // this is nessecary to stabilize after hovering
      item.index = dropIndex;
      // setTimeout(moveTask(dragIndex, dropIndex), 500)
    }
  })

  //todo make hover move things and drop write changes to DB
  //  !wtf is this
  drag(drop(ref))
  return ( 
    <div ref={ref} data-handler-id={handlerId} >
      <div className={`task-box ${intToPriority(priority)}-border`}
        onMouseOver={() => setButtonShow(true)}
        onMouseLeave={() => setTimeout(() => setButtonShow(false), 500)}
        // style={{opacity: isDragging ? 0.1 : 1, cursor: 'move'}}
        >
          <input type="text" 
            className={"title-display white-font"} 
            onChange={(event) => updateTitle(event, index)} 
            value={title}
            />
            {showButtons ? <div className="edit-buttons" >
              <Trashbutton removeTask={() => removeTask(index, pk)}/>
              <PriorityButton 
                size={"small-button"} 
                priority={intToPriority(priority)} 
                click={() => setPriority(index)}
                />
            </div>: null}
      </div>
    </div>
  )    
} 
