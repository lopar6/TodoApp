import { unmountComponentAtNode } from "react-dom"
import { act } from "react-dom/test-utils"
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'



import { Todo } from "./todo"

let container = null
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div")
  document.body.appendChild(container)
  render(<Todo/>)
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container)
  container.remove()
  container = null
});

test('Todo text box component renders', () => {
    act(() => {
        // render components
      })
      // make assertions
      const inputNode = screen.getByPlaceholderText("Enter a new task")
      expect(inputNode).toBeInTheDocument()
})

test('renders save button', () => {
    act( () => {
    })
    const saveButton = screen.getByDisplayValue(/save/)
    expect(saveButton).toBeInTheDocument()
    });
    
test('clicking save adds new task if text entered', () => {
    render(<Todo/>)
    const saveButton = screen.getByText(/save/i)
    const textBox = screen.getByPlaceholderText("Enter a new task")
    fireEvent.change(textBox, {
        target: {
            value: "Do the Dishes"
        }
    })
    fireEvent.click(saveButton)
    const task = screen.getByDisplayValue("Do the Dishes")
    expect(task).toBeInTheDocument()

})

// todo added api call tests

