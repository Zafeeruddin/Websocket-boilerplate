import { useEffect, useState } from "react"
function App(){
  const [ws,setWs] = useState<WebSocket>()
  const [id,setId]= useState(()=>{
    const savedId = localStorage.getItem("globId")
    return savedId ? parseInt(savedId,10)+1: 1;
  })
  useEffect(()=>{
    const client = new WebSocket("ws://localhost:8080")
    setWs(client)
    client.onopen=(()=>{
      console.log("Hey connected",id)
      client.send(JSON.stringify(id))

    })

    client.onmessage = ((e)=>{
      console.log("Event data is",e.data)
    })

    localStorage.setItem("globId",JSON.stringify(id))
    
  },[])

  const disconnect = ()=>{
    console.log("inside")
    if(ws===undefined){
      console.log("ws aint there")
      return
    }
    console.log("ws is",ws)
    ws.close()
    ws.onclose= ()=>{
      console.log(`${id} is closed`)
      ws.send(JSON.stringify(id))
    }
  }
  return (
    <>
      <div>
        Connecting...
      </div>
      <button onClick={disconnect}>Disconnect</button>
    </>
  )
}

export default App