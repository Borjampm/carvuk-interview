import { useState } from 'react'

export default function Button() {
    const [value, setValue] = useState(0)
  return (<>
  <button onClick={() => setValue(value + 1)}>Click me</button>
  <p>{value}</p>
</>)
}