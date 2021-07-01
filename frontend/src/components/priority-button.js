// props.priority ? props.priority : "low"
// todo make buttons pretty 
export const  PriorityButton = (props, monitor) => {
    return( <input 
      type="button" 
      className={`input-button ${props.priority} ${props.size}`} 
      onClick={props.click}/>
      )
  }