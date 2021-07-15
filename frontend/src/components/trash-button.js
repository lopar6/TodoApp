import { motion } from "framer-motion"

export const Trashbutton = ({size = 'small-button', removeTask}) => {
  // if animation values change, change Priority Button as well 
  return <motion.div 
      whileHover={{
      scale: 1.1,
      transition: { duration: .2, },
    }}
    whileTap={{ scale: 0.9 }}>
      <input type="button" className={`trash ${size}`} onClick={removeTask}></input>
    </motion.div> 
  }