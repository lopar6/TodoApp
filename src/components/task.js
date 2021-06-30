import { useState, useRef, useEffect } from 'react'
import { useDrag, useDrop } from 'react-dnd';

import { Trashbutton } from './trash-button';
import { PriorityButton } from './priority-button';

export function Task({index, title, priority, removeTask, moveTask, updateTitle, setPriority}) {
    const [showButtons, setButtonShow] = useState(null)  
    const ref = useRef(null)
    
    useEffect(() => {
    }, [index, title, priority])

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
      //add this when API is up
      // drop: (item) => {
      // const dragKey = item.index
      // const dropKey = index
      
      // },
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
      <div ref={ref} data-handler-id={handlerId}>
        {/* {console.log(title, props.index, "has rendered")} */}
        <div className={`task-box ${priority}-border`}
          // onClick={this.moveElement} 
          onMouseOver={() => setButtonShow(true)}
          onMouseLeave={() => setTimeout(() => setButtonShow(false), 500)}
          style={{opacity: isDragging ? 0.5 : 1, cursor: 'move'}}
          // ref={drag}
          >
            <input type="text" 
                  className={"title-display white-font"} 
                  onChange={(event) => updateTitle(event, index)} 
                  value={title}/>
              {showButtons ? <div className="edit-buttons" >
                <Trashbutton removeTask={() => removeTask(index)}/>
                <PriorityButton size={"small-button"} 
                                priority={priority} 
                                click={() => setPriority(index)}
                                />
              </div>: null}
        </div>
      </div>
      )    
  } 
