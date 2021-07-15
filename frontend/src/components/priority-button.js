import { motion } from "framer-motion"

export const  PriorityButton = (props, monitor) => {
    // if animation values change, change Trash Button as well 
    return <motion.div 
    whileHover={{
    scale: 1.1,
    transition: { duration: .2, },
  }}
  whileTap={{ scale: 0.9 }}>
    <input 
      type="button" 
      className={`input-button ${props.priority} ${props.size}`} 
      onClick={props.click}/>
    </motion.div> 
  }