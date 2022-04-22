import React, { useEffect, useState } from "react";
import {useCookies} from "react-cookie";
import {Link, useNavigate} from "react-router-dom";
import { url } from "../API";
import { useParams } from "react-router-dom";

export default function Comments(props){
    const [cookies] = useCookies("token");
    let reload = props.reload;
    let setReload = props.setReload;
    let [items, setItems] = useState(null);
    let [updateItems, setUpdateItems] = useState(true);
    let [get_url, updateUrl] = useState(new URL(url+"comments/"));
    var bearer = "Bearer " + cookies.token;
    let payload = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    }

    get_url.searchParams.append("restaurant_id", props.id);

    useEffect(()=> {
        fetch(get_url, payload).then((resp) => resp.json())
        .then(body => setItems(body));
    }, [updateItems, reload, get_url]);

    function setUrl(newurl){
        updateUrl(new URL(getCorrectUrl(newurl)));
    }

    const local_url = new RegExp('http://127.0.0.1:8000/(.*)');

    function getCorrectUrl(curr_url){
        let match = curr_url.match(local_url);
        return url + match[1];
    }


    

    function dispalyItems(){
        if(items!==null){
            if(items.next!==null && items.previous!==null){
            return (<div>
                    {items && items.results.map(item => <li><strong>{item.user.username}</strong>: {item.text}</li>)}
                    <div class="center">
                    <button class="btn btn-secondary" onClick={()=>setUrl(items.previous)}>Prev</button>
                    <button class="btn btn-secondary" onClick={()=>setUrl(items.next)}>Next</button>
                    </div>
                </div>)
            } else if(items.next!==null){
                return (<div>
                    {items && items.results.map(item => <li><strong>{item.user.username}</strong>: {item.text}</li>)}
                    <div class="center">
                    <button class="btn btn-secondary"onClick={()=>setUrl(items.next)}>Next</button>
                    </div>
                </div>)
            } else if(items.previous!==null){
                return (<div>
                    {items && items.results.map(item => <li><strong>{item.user.username}</strong>: {item.text}</li>)}
                    <div class="center">
                    <button class="btn btn-secondary"onClick={()=>setUrl(items.previous)}>Prev</button>
                    </div>
                </div>)
             }else{
            return (<div>
                    {items && items.results.map(item => <li><strong>{item.user.username}</strong>: {item.text}</li>)}
                </div>)
            }
       } else{
            return (<p>Loading Items</p>)
        }
   }
    return(
        <div>{dispalyItems()}</div>
    );
}