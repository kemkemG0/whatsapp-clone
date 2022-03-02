import styled from "styled-components";
import { db, auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { Avatar } from "@material-ui/core";
import MoreVert from "@material-ui/icons/MoreVert";
import AttachFile from "@material-ui/icons/AttachFile"
import { Button } from "@material-ui/core";
import { IconButton } from "@material-ui/core";
import { useCollection } from "react-firebase-hooks/firestore";
import { addDoc, collection, doc,query, serverTimestamp, setDoc,orderBy } from "@firebase/firestore";
import Message from "./Message";
import { InsertEmoticon } from "@material-ui/icons";
import { Mic } from "@material-ui/icons";
import { useState } from "react";


const ChatScreen = ({chat,messages}) => {
    const [user] = useAuthState(auth);
    const [input, setInput] = useState("");
    const router = useRouter();
    const [messagesSnapshot] = useCollection(
        query(
            collection(db,"chats",router.query.id,"messages"),
            orderBy("timestamp","asc")
            )
        );

    const showMessages = () => {
        if(messagesSnapshot){
            return messagesSnapshot.docs.map(message=>(
                <Message
                    key={message.id}
                    user={message.data().users}
                    message={{
                        ...message.data(),
                        timestamp:message.data().timestamp?.toDate().getTime()
                    }}
                />
            ))
        }else{
            return JSON.parse(messages).map(message =>(
                <Message key={message.id} user={message.user} message={message}/>
            ))
        }
    }
    const sendMessage = (e) =>{
        e.preventDefault();
        setDoc(doc(db,"users",user.uid),{lastSeen: serverTimestamp()},{merge: true});
        addDoc(collection(db,"chats",router.query.id, "messages"),{
            timestamp: serverTimestamp(),
            message:input,
            user:user.email,
            photoURL: user.photoURL,
        })
        setInput("");
    }

    return(
        <Container>
            <Header>
                <Avatar/>
                <HeaderInformation>
                    <h3>Rec Email</h3>
                    <p>Last Seen ...</p>
                </HeaderInformation>
                <HeaderIcons>
                    <IconButton>
                        <AttachFile/>
                        <MoreVert/>
                    </IconButton>
                </HeaderIcons>
            </Header>

            <MessageContainer>
                {showMessages()}
                <EndOfMessage/>
            </MessageContainer>

            <InputContainer>
                <InsertEmoticon />
                <Input value={input} onChange={e=>setInput(e.target.value)}/>
                <button hidden disable={!input} type="submit" onClick={sendMessage}>Send Message</button>
                <Mic/>
            </InputContainer>
        </Container>
    )
}


export default ChatScreen;


const Container = styled.div``;


const Header = styled.div`
    position:sticky;
    background-color:white;
    z-index:100;
    top:0;
    display:flex;
    padding: 11px;
    align-items: center;
    border-bottom:1px solid whitesmoke;
`;

const HeaderInformation = styled.div`
    margin-left:15px;
    flex:1;
    > h3 {
        margin-bottom:3px;
    }
    > p {
        font-size:14px;
        color:gray;
    }
`;

const HeaderIcons = styled.div``;

const EndOfMessage = styled.div``;


const MessageContainer = styled.div`
    padding:30px;
    background-color:#e5ded8;
    min-height:90vh;
`;


const InputContainer = styled.form`
    display:flex;
    align-items:center;
    padding:10px;
    position:sticky;
    bottom:0;
    background-color:white;
    z-index:100;
`;


const Input = styled.input`
    flex:1;
    outline:0;
    border:none;
    border-radius:10px;
    background-color:whitesmoke;
    padding:20px;
    margin-left:15px;
    margin-right:15px;
`;
