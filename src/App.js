import React, {useEffect, useState, useRef} from 'react'

// import { ItemTypes } from './Constants'

import './App.css'
import { Todo } from './components/todo';

// todo move png to public
// todo check for first time visit and give them a little tour  
  
function cyclePriority(priority) {
  if (priority == 'low')   {return 'medium'}
  if (priority == 'medium'){return 'high'}
  if (priority == 'high')  {return 'low'}    
}

// monitor.getItem() <- maybe use this to get task being handled





  
  function App() {
    return (
      <div id="todo-container"><Todo/></div>
    );
  }
export default App;
