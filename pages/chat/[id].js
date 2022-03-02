import styled from "styled-components"
import Head from "next/head"
import Sidebar from "../../components/Sidebar"
import ChatScreen from "../../components/ChatScreen"
import { getDoc,getDocs } from "@firebase/firestore"
import { db } from "../../firebase"
import {doc, query,where,collection,orderBy,collectionGroup} from "firebase/firestore"
import { Timestamp } from "@firebase/firestore"
import getRecipientsEmail from "../../utils/getRecipientEmail"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "../../firebase"

const Chat = ({chat, messages}) => {
    const [user] = useAuthState(auth);
    return(
        <Container>
            <Head>
                <title>Chat with {getRecipientsEmail(chat.users, user)}</title>
            </Head>
            <Sidebar/>
            <ChatContainer>
                <ChatScreen chat={chat} messages={messages}/>
            </ChatContainer>
        </Container>
    );
}


export default Chat;

export const getServerSideProps = async (context) =>{
    const chatRef =  doc(collection(db,"chats"),context.query.id);
    const chatRes = await getDoc(chatRef);
    
    
    const messagesDocs = await getDocs(query(collection(db,"chats",context.query.id,"messages"),orderBy("timestamp","asc")));
    const messages = messagesDocs.docs.map(doc=>{
        return{
            id:doc.id,
            ...doc.data()
        }
    }).map(message=>({
        ...message,
        timestamp:message.timestamp?.toDate().getTime(),
    }));

    const chat = {
        id:chatRes.id,
        ...chatRes.data()
    }

    return{
        props:{
            messages: JSON.stringify(messages),
            chat: chat
        }
    }
}

const Container = styled.div`
    display: flex;
`;

const ChatContainer = styled.div`
    flex:1;
    overflow:scroll;
    height: 100vh;
    ::-webkit-scrollbar{
        display: none;
    }
`;
