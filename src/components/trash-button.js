export const Trashbutton = (size = 'small-button', removeTask) => {
    return <input type="button" className={`trash ${size}`} onClick={removeTask}></input>
  }