import { fetchRequest } from "../api";
import {ENDPOINT}  from "../common";

const onProfileClick =(event) =>{

}

const loadUserProfile = async() =>{
    const defaultImage = document.querySelector("#default-image");
    const profileImage = document.querySelector("#user-profile-btn");
    const displayNameElement = document.querySelector("#display-name")

    const {display_name:displayName,images} = await fetchRequest(ENDPOINT.userInfo);
    if(images?.length){
        defaultImage.closelist.add("hidden")
    }
    else{
        defaultImage.closelist.remove("hidden")
    }
    profileButton.addEventListener("click",onProfileClick)
    displayNameElement.textContent = displayName


}



document.addEventListener("DOMContentLoaded",()=>{
    loadUserProfile()

})