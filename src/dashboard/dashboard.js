import { fetchRequest } from "../api";
import { ENDPOINT } from "../common";

const onProfileClick = (event) => {
    const profileMenu = document.querySelector("#profile-menu")
    profileMenu.classList.toggle("hidden")
    if (!profileMenu.classList.contains("hidden")) {
        profileMenu.querySelector("li#logout").addEventListener("click", logout)

    }
}

const onClickPlaylistItem =()=>{
    console.log(event.target);
}

const loadFeaturePlaylist = async () => {
    const { playlists: { items } } = await fetchRequest(ENDPOINT.featurePlaylist)
    const playlistItemsContainer = document.querySelector("#featured-playlist-items")

    for (let { name, description, images,id } of items) {
        const playlistItem = document.createElement("section");
        playlistItem.className="rounded p-2 hover:cursor-pointer border-solid border-2";
        playlistItem.id = id;
        playlistItem.setAttribute("data-type","playlist")
        playlistItem.addEventListener("click",onClickPlaylistItem)
        const [{ url:imageUrl }] = images;
        playlistItem.innerHTML = `
              <img src=${imageUrl} alt=${name} class="rounded  object-contain shadow" />
              <h2 class="text-sm">${name}</h2>
              <h3 class="text-xs">${description}</h3>
            `
            playlistItemsContainer.appendChild(playlistItem)
        
    }


}

const loadUserProfile = async () => {
    const defaultImage = document.querySelector("#default-image");
    const profileButton = document.querySelector("#user-profile-btn");
    const displayNameElement = document.querySelector("#display-name")

    const { display_name: displayName, images } = await fetchRequest(ENDPOINT.userInfo);
    if (images?.length) {
        defaultImage.classList.add("hidden")
    }
    else {
        defaultImage.classList.remove("hidden")
    }
    profileButton.addEventListener("click", onProfileClick)
    displayNameElement.textContent = displayName


}



document.addEventListener("DOMContentLoaded", () => {
    loadUserProfile()
    loadFeaturePlaylist()
    document.addEventListener("click", () => {
        const profileMenu = document.querySelector("#profile-menu");
        if (!profileMenu.classList.contains("hidden")) {
            profileMenu.classList.add("hidden")
        }
    })

})