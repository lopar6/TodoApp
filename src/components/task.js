import { useState, useRef, useEffect } from 'react'
import { useDrag, useDrop } from 'react-dnd';

import { Trashbutton } from './trash-button';
import { PriorityButton } from './priority-button';
import { cyclePriority } from '../services/cycle-priority';

export function Task({key, index, title, priority, removeTask, moveTask, updateTitle, setPriority}) {
    const [showButtons, setButtonShow] = useState(null)  
    const ref = useRef(null)
    
    useEffect(() => {
      console.log(index, title)
    }, [index, title])

    const [{isDragging}, drag] = useDrag(({
      type: 'Task',
      item: () => {
        return {index}
      },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
        // todo change this to only passing index
        taskItem: monitor.getItem()
      }),
      dropEffect: "move",
    }))
  // !may need to pass in key value for dnd

    const [, drop, monitor] = useDrop(
      () => ({
        accept: 'Task',
        collect: (monitor) => ({
          // isDragging: !!monitor.isDragging(),
          taskItem: monitor.getItem()
        }),

        //todo add hover moving mechanics
        hover: (item) => {
          // const dragKey = item.index
          // const dropKey = index
        },
        drop: (item) => {
          // Determine rectangle on screen
          // if the reference to the drop DOM object does not exist
          // do not continue
          // let dragTask = item
          const dragIndex = item.index
          console.log(item)
          const dropIndex = index
          console.log("drag", dragIndex, "drop", dropIndex)
          // dont replace items with themselves
          if (dragIndex === dropIndex) {return}
          moveTask(dragIndex, dropIndex)
          //! how is this possible
          item.index = dropIndex

        //todo finish this logic

        if (!ref.current) {return}
        // find rectangle location of div
        // const boundingRect = dropRef.current.getBoundingClientRect()
        // const middleY = (boundingRect.bottom - boundingRect.top) / 2
        // get mouse position
        // const mouseOffest = monitor.getClientOffset()


        //todo add logic to make sure tasks are moved to the correct place (above or below halfway)
        }
      })
    )
//  !wtf is this
//todo make hover move things and drop write changes to DB
    drag(drop(ref))
    return ( 
      <div ref={ref}>
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
                                click={() => setPriority(cyclePriority(priority))}
                                />
              </div>: null}
        </div>
      </div>
      )    
  } 
