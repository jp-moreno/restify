import React, { useEffect, useState } from "react";
import {useCookies} from "react-cookie";
import {Link, useNavigate} from "react-router-dom";
import { url } from "../API";
import { useParams } from "react-router-dom";

export default function MenuItems(props){
    const [cookies] = useCookies("token");
    let reload = props.reload;
    let setReload = props.setReload;
    let [items, setItems] = useState(null);
    let [updateItems, setUpdateItems] = useState(true);
    let [get_url, updateUrl] = useState(new URL(url+"menus/"));
    var bearer = "Bearer " + cookies.token;
    let payload = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    }

    get_url.searchParams.append("restaurant_id", props.id);

    useEffect(()=> {
        console.log("updating");
        fetch(get_url, payload).then((resp) => resp.json())
        .then(body => setItems(body));
    }, [updateItems, reload, get_url]);

    const local_url = new RegExp('http://127.0.0.1:8000/(.*)');

    function getCorrectUrl(curr_url){
        let match = curr_url.match(local_url);
        return url + match[1];
    }



    function setUrl(newurl){
        updateUrl(new URL(getCorrectUrl(newurl)));
    }
    

    function deleteItem(id){
        let payloadbody = JSON.stringify({item_id:id})
        let payload2 = {
        method: 'DELETE',
        withCredentials: true,
        credentials: 'include',
        headers: {
            'Authorization': bearer,
            'Content-Type': 'application/json'
        },
        body: payloadbody
    }

        fetch(url+"menus/", payload2).then(() => setUpdateItems(res=>!res));
    }

    function dispalayItem(item){
        if (props.edit){
            return(
            <tr class="menu-tr"><td><button class="btn btn-danger" onClick={()=>{deleteItem(item.id)}}>Delete</button></td><td>{item.name}</td><td>{item.desc}</td><td>{item.price}</td></tr>)
        }else{
            return(<tr class="menu-tr"><td>{item.name}</td><td>{item.desc}</td><td>{item.price}</td></tr>)
        }
    }


    function dispalyItems(){
        if(items!==null){
            if(props.edit){
            if(items.next!==null && items.previous!==null){
            return (<div>
                    <table>
                        <tr>
                            <th>Delete</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Price</th>
                        </tr>
                        {items && items.results.map(item => dispalayItem(item))}
                    </table>
                    <button class="btn btn-secondary" onClick={()=>setUrl(items.previous)}>Prev</button>
                    <button class="btn btn-secondary" onClick={()=>setUrl(items.next)}>Next</button>
                </div>)
            } else if(items.next!==null){
                return (<div>
                    <table>
                        <tr>
                            <th>Delete</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Price</th>
                        </tr>
                    {items && items.results.map(item => dispalayItem(item))}
                    </table>
                    <button class="btn btn-secondary" onClick={()=>setUrl(items.next)}>Next</button>
                </div>)
            } else if(items.previous!==null){
                return (<div>
                    <table>
                        <tr>
                            <th>Delete</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Price</th>
                        </tr>
                    {items && items.results.map(item => dispalayItem(item))}
                    </table>
                    <button class="btn btn-secondary" onClick={()=>setUrl(items.previous)}>Prev</button>
                </div>)
             }else{
            return (<div>
                    <table>
                        <tr>
                            <th>Delete</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Price</th>
                        </tr>
                     {items && items.results.map(item => dispalayItem(item))}
                    </table>
                </div>)
            }
        // COPIED
            }else{
            if(items.next!==null && items.previous!==null){
            return (<div>
                    <table>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Price</th>
                        </tr>
                        {items && items.results.map(item => dispalayItem(item))}
                    </table>
                    <button class="btn btn-secondary" onClick={()=>setUrl(items.previous)}>Prev</button>
                    <button class="btn btn-secondary" onClick={()=>setUrl(items.next)}>Next</button>
                </div>)
            } else if(items.next!==null){
                return (<div>
                    <table>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Price</th>
                        </tr>
                    {items && items.results.map(item => dispalayItem(item))}
                    </table>
                    <button class="btn btn-secondary" onClick={()=>setUrl(items.next)}>Next</button>
                </div>)
            } else if(items.previous!==null){
                return (<div>
                    <table>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Price</th>
                        </tr>
                    {items && items.results.map(item => dispalayItem(item))}
                    </table>
                    <button class="btn btn-secondary" onClick={()=>setUrl(items.previous)}>Prev</button>
                </div>)
             }else{
            return (<div>
                    <table>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Price</th>
                        </tr>
                     {items && items.results.map(item => dispalayItem(item))}
                    </table>
                </div>)
            }
        }
 
       } else{
            return (<p>Loading Items</p>)
        }
   }
    return(
        <div>{dispalyItems()}</div>
    );
}