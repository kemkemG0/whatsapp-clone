import styled from "styled-components";
import { Avatar } from "@material-ui/core";
import getRecipientsEmail from "../utils/getRecipientEmail";
import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth } from "../firebase";
import { useCollection } from "react-firebase-hooks/firestore"; 
import {doc, query,where,collection} from "firebase/firestore"
import { useRouter } from "next/router";

const Chat = ({id, users}) => {
    const router = useRouter();

    const [user] = useAuthState(auth);
    const [recipientSnapshot] = useCollection(query(collection(db,"users"),where("email", "==", getRecipientsEmail(users,user))))
    const recipientEmail = getRecipientsEmail(users, user);

    const enterChat = () =>{
        router.push(`/chat/${id}`);
    }


    const recipient = recipientSnapshot?.docs?.[0]?.data();
    return(
        <Container onClick={enterChat}>
            {recipient ? (
                <UserAvatar src={recipient?.photoURL}/>)
                :
                (<UserAvatar>{recipientEmail[0]}</UserAvatar>)
            }
            <p>{recipientEmail}</p>
        </Container>
    )
}


export default Chat;


const Container = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 15px;
    word-break: break-word;
    :hover{
        background-color:#e9eaeb;
    }
`;

const UserAvatar = styled(Avatar)`
margin:5px;
margin-right:15px;
`;