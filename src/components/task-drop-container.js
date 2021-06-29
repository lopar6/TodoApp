import { useDrop } from 'react-dnd';
import { useRef, useState } from 'react';

// cosider making drag/drop same component
// consider adding hover 'drop preview'
export const TaskDropContainer = (props, child) => {
    const dropRef = useRef(null)
    const [index, setIndex] = useState()

    const [, drop, monitor] = useDrop(
      () => ({
        accept: 'Task',
        //todo add hover moving mechanics
        hover: (item) => {
          const dragKey = item.index
          const dropKey = props.index
        },
        drop: (item) => {
          // Determine rectangle on screen
          // if the reference to the drop DOM object does not exist
          // do not continue
          const dragKey = item.index
          const dropKey = index
          props.moveTask(dragKey, dropKey)
          setIndex(dropKey)


          //todo finish this logic

          if (!dropRef.current) {return}
          // dont replace items with themselves
          if (dragKey === dropKey) {return}
          // find rectangle location of div
          const boundingRect = dropRef.current.getBoundingClientRect()
          const middleY = (boundingRect.bottom - boundingRect.top) / 2
          // get mouse position
          const mouseOffest = monitor.getClientOffset()


          //todo add logic to make sure tasks are moved to the correct place (above or below halfway)
        }
      })
    )
    return(
      <div ref={drop} >{props.task}</div>
    )
  }