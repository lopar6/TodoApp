import { useDrop } from 'react-dnd';

export const TaskDropContainer = (props) => {
    const [, drop, monitor] = useDrop(
      () => ({
        accept: 'Task',
        // (drop spot value , dropee value )
        // collect: (monitor) => ({
        //   draggingTask: monitor.getItem()
        // }),
        drop: () => props.moveTask(props.task.props.keyValue, monitor.draggingTask)
      })
    )
    return(
      <div ref={drop}>{props.task}</div>
    )
  }