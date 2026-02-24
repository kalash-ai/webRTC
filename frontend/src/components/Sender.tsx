import { useEffect, useState } from "react"

export function Sender (){
const [socket, setSocket] = useState<WebSocket | null>(null);
        
        useEffect(() => {
            const socket = new WebSocket("ws://localhost:8080");
            socket.onopen= ()=>{
                socket.send(JSON.stringify({type: 'sender'}))
            }
            setSocket(socket)
        },[])


      async function startSendingVidee(){
    // creating an offer
    if(!socket) return;

    const pc  = new RTCPeerConnection();
    const offer  = await pc.createOffer(); 
    //gives you the SDP(persmission which allows you to interact with the other party/user)
    await pc.setLocalDescription(offer)

    pc.onicecandidate =(event)=>{
        console.log(event)
        if(event.candidate){
            socket.send(JSON.stringify({type :'iceCandidate', candidate : event.candidate}))
        }
    }
 socket?.send(JSON.stringify({type :'createOffer', sdp : pc.localDescription}))

 socket.onmessage =(event)=>{
    const data = JSON.parse(event.data);
    if(data.type ==='createAnswer'){
        pc.setRemoteDescription(data.sdp)
    }
 }

   }     
return <div>
        sender
        <button onClick={startSendingVidee}>Send Video</button>
    </div>
}