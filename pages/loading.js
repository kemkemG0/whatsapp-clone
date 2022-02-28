import {Circle} from "better-react-spinkit"

const Loading = () => {
    return(
        <center style={{display:"grid",placeItems:"center",height:"100vh"}}>
            <div>
            <img
                src="https://cdn.iconscout.com/icon/free/png-512/whatsapp-42-189793.png"
                alt=""
                style={{marginBottom:10}}
                height={200}
            />
            <Circle color="#3CBC28" size={60} />
            </div>
        </center>
    )
}

export default Loading;