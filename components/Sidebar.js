import { Avatar, IconButton } from "@material-ui/core";
import styled from "styled-components";
import ChatIcon from "@material-ui/icons/Chat"
import  MoreVertIcon  from "@material-ui/icons/MoreVert";
import SearchIcon from "@material-ui/icons/Search"
import { Button } from "@material-ui/core";
import * as EmailValidator from "email-validator";
import { auth, db } from "../firebase";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import {doc, query,where} from "firebase/firestore"
import { async } from "@firebase/util";
import Chat from "./Chat"
import {useCollection}  from "react-firebase-hooks/firestore";


const Sidebar =  () =>{
    console.log("Sidebar");
    const [user] = useAuthState(auth);
    const userChats =  query(collection(db, "chats"), where("users", "array-contains",user.email));
    const [chatsQuerySnapshot] = useCollection(userChats)

    const createChat = async () => {
        const input = prompt('Please enter an email address for the user you wish to chat width');

        if(!input) return null;
        const isExist = chatAlreadyExists(input);
        console.log("out", isExist)

        if(EmailValidator.validate(input) && input!=user.email && !isExist) {
            // we need to add the chat into the DB 'chats' collection
            const docRef = await addDoc(collection(db,"chats"),{
                users:[user.email, input],
            });
        }
    }
    const chatAlreadyExists =  (recipientEmail)=>{
        const ret =  !!chatsQuerySnapshot?.docs.find(
            (chat)=>
                chat.data().users.find( (user) => user === recipientEmail)?.length > 0
            );
        console.log("inside",ret)
        return ret;
    }


    return(
        <Container>
            <Header>
                <UserAvatar onClick={()=>auth.signOut()} src={user?.photoURL}/>
                <IconsContainer>
                    <IconButton>
                        <ChatIcon/>
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon/>
                    </IconButton>
                </IconsContainer>
            </Header>
            
            <Search>
                <SearchIcon />
                <SearchInput placeholder="Search in chats"/>
            </Search>
            <SidebarButton onClick={()=>{createChat()}}>Start a new chat</SidebarButton>
            
            {/* List of chats */}
            { chatsQuerySnapshot?.docs.map((chat)=>(
                <Chat key={chat.id} id={chat.id} users={chat.data().users}/>
            ))
            }
        </Container>
    );
}

export default Sidebar;


const Container = styled.div``;

const Header = styled.div`
    display: flex;
    position:sticky;
    top:0;
    background-color:white;
    z-index:1;
    justify-content:space-between;
    align-items:center;
    padding:15px;
    height:80px;
    border-bottom:1px solid whitesmoke;
`;

const UserAvatar = styled(Avatar)`
    cursor:pointer;
    :hover{
        opacity: 0.8;
    }
`;

const IconsContainer = styled.div`
    display: flex;
`;


const Search = styled.div`
    display: flex;
    align-items:center;
    padding: 20px;
    border-radius:2px;
`;


const SearchInput = styled.input`
    outline-width: 0px;
    border:none;
    flex:1;
`;


const SidebarButton = styled(Button)`
    width:100%;
    &&&{
        border-top: 1px solid whitesmoke;
        border-bottom: 1px solid whitesmoke;
    }
`

