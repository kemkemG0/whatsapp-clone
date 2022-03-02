import styled from "styled-components"
const Message = ({user,message}) =>{
    console.log("message")
    console.log(message)
    return(
        <Container>
            {message.message}
            {/* <p>message</p> */}
        </Container>)
}

export default Message;


const Container = styled.div``;