import React, { useEffect, useState } from "react";
import {useCookies} from "react-cookie";
import {Link, useNavigate} from "react-router-dom";
import { url } from "../API";
import { useParams } from "react-router-dom";

export default function FollowButton(props){
    const [cookies] = useCookies("token");
    let reload = props.reload;
    let setReload = props.setReload;
    let [liked, setLiked] = useState(-1);
    let get_url = new URL(url+"follows/");
    var bearer = "Bearer " + cookies.token;
    let payload = {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {
            'Authorization': bearer,
            'Content-Type': 'application/json'
        },
    }

    get_url.searchParams.append("restaurant_id", props.id);

    useEffect(()=> {
        fetch(get_url, payload).then((resp) => {
            if(resp.status=="200"){
                setLiked(1);
            } else if(resp.status=="404"){
                setLiked(0);
            }
        })
    },  [reload]);

    function followRestaurant(){
        let payloadBody = JSON.stringify({restaurant_id:props.id});
        let payload2 = {
            method: 'POST',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Authorization': bearer,
                'Content-Type': 'application/json'
            },
            body: payloadBody
        }

        fetch(url+"follows/", payload2).then(setReload((prev)=>!prev));
    }
    
    function unfollowRestaurant(){
        let payloadBody = JSON.stringify({restaurant_id:props.id});
        let payload2 = {
            method: 'DELETE',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Authorization': bearer,
                'Content-Type': 'application/json'
            },
            body: payloadBody
        }

        fetch(url+"follows/", payload2).then(setReload((prev)=>!prev));
    }
 

    function displayLikeButton(){
        if(liked==-1){
            return (<p>Loading test</p>)
        }else if(liked == 0 ){
            return (<button class="btn btn-success my-btn" onClick={followRestaurant}>Follow</button>)

        } else{
            return (<button class="btn btn-danger my-btn" onClick={unfollowRestaurant}>Unfollow</button>)
        }
   }
    return(
        <div>{displayLikeButton()}</div>
    );
}