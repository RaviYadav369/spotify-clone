import { fetchRequest } from "../api";
import { ENDPOINT, SECTIONTYPE } from "../common";

const onProfileClick = () => {
    const profileMenu = document.querySelector("#profile-menu")
    profileMenu.classList.toggle("hidden")
    if (!profileMenu.classList.contains("hidden")) {
        profileMenu.querySelector("li#logout").addEventListener("click", logout)

    }
}

const onClickPlaylistItem = (event, id) => {
    const section = { type: SECTIONTYPE.PLAYLIST, playlistId: id }
    history.pushState(section, "", `playlists/${id}`)
    loadSections(section)
}

const loadPlaylist = async (endpoint, elementId) => {
    const { playlists: { items } } = await fetchRequest(endpoint)
    const playlistItemsContainer = document.querySelector(`#${elementId}`)

    for (let { name, description, images, id } of items) {
        const playlistItem = document.createElement("section");
        playlistItem.className = "rounded bg-black-secondary p-2 hover:cursor-pointer border-solid border-2 hover:bg-light-black";
        playlistItem.id = id;
        playlistItem.setAttribute("data-type", "playlist")
        playlistItem.addEventListener("click", (event) => onClickPlaylistItem(event, id))
        const [{ url: imageUrl }] = images;
        playlistItem.innerHTML = `<img src=${imageUrl} alt=${name} class="rounded  object-contain shadow" />
              <h2 class="text-base font-semibold truncate mb-4">${name}</h2>
              <h3 class="text-sm text-secondary line-clamp-2">${description}</h3>`

        playlistItemsContainer.appendChild(playlistItem);
    }
}

const loadPlaylists = () => {
    loadPlaylist(ENDPOINT.featurePlaylist, "featured-playlist-items")
    loadPlaylist(ENDPOINT.toplist, "top-playlist-items")
}

const fillContentForDashboard = () => {
    const playlistMap = new Map([["Featured", "featured-playlist-items"], ["Top Playlist", "top-playlist-items"]])
    let innerHTML = "";
    const pageContent = document.querySelector("#page-content")
    for (let [type, id] of playlistMap) {
        innerHTML += `
        <article class="p-4">
          <h1 class="text-2xl mb-4">${type}</h1>
          <section id="${id}" class="featured-songs grid grid-cols-auto-fill-cards gap-4">
        
          </section>
        </article>
        `
    }
    pageContent.innerHTML = innerHTML
}

const formatTime =(duration)=>{
    const min = Math.floor(duration/60_000);
    const sec = ((duration%6000)/1000).toFixed(0);
    const formattedTime = sec==60?
    min+1 + ":00":min +":" + (sec<10? "0":"") +sec;
    return formattedTime
}

const loadPlaylistTracks = ({ tracks }) => {
    const trackSection = document.querySelector("#tracks")
    let trackNo=1;
    for (let trackitem of tracks.items) {
        let { id,artists, name, album, duration_ms } = trackitem.track
        let track = document.createElement("section")
        track.className="grid p-1 items-center tracks justify-items-start rounded-md hover:bg-light-black  grid-cols-[50px_2fr_1fr_50px] gap-4 text-secondary"
        let image = album.images.find(img => img.height===64)
        track.innerHTML=`<p>${trackNo++}</p>
        <section class="grid grid-cols-[auto_1fr] place-items-center gap-1">
          <img class="h8 w-8" src="${image.url}" alt="${name}" />
          <article class="flex flex-col">
            <h2 class="text-primary text-xl">${name}</h2>
            <p class="text-sm ">${Array.from(artists,artist=> artist.name).join(", ")}</p>
          </article>
        </section>
        <p>${album.name}</p>
        <p>${formatTime(duration_ms)}</p>
        `
        trackSection.appendChild(track)
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

const fillContentForPlaylist = async (playlistId) => {
    const playlist = await fetchRequest(`${ENDPOINT.playlist}/${playlistId}`)
    const pageContent = document.querySelector("#page-content")
    pageContent.innerHTML = `
    <header class="px-8 py-1 text-white font-semibold text-xl border-b-2 bg-light-black" id="playlist-header">
    <nav>
      <ul class="grid grid-cols-[50px_2fr_1fr_50px] gap-4 text-secondary ">
        <li>#</li>
        <li>Title</li>
        <li>Album</li>
        <li>⏱️</li>
      </ul>
    </nav>
    </header>

  <section class="px-8 text-secondary mt-3" id="tracks"></section>
    `
    loadPlaylistTracks(playlist)

}

const loadSections = (section) => {
    if (section.type === SECTIONTYPE.DASHBOARD) {
        fillContentForDashboard()
        loadPlaylists()
    }
    else if (section.type === SECTIONTYPE.PLAYLIST) {
        console.log(section.playlistId);
        fillContentForPlaylist(section.playlistId)
    }
}


document.addEventListener("DOMContentLoaded", () => {
    loadUserProfile()
    const section = { type: SECTIONTYPE.DASHBOARD };
    history.pushState(section, "", "")
    loadSections(section)

    document.addEventListener("click", () => {
        const profileMenu = document.querySelector("#profile-menu");
        if (!profileMenu.classList.contains("hidden")) {
            profileMenu.classList.add("hidden")
        }
    })

    document.querySelector(".content").addEventListener("scroll", (event) => {
        const { scrollTop } = event.target
        const header = document.querySelector(".header")
        if (scrollTop >= header.offsetHeight) {
            header.classList.add("sticky", "top-0", "bg-black-secondary")
            header.classList.remove("bg-transparent")
        } else {
            header.classList.remove("sticky", "top-0", "bg-black-secondary")
            header.classList.add("bg-transparent")

        }
        if(history.state.type === SECTIONTYPE.PLAYLIST){
            const playlistHeader = document.querySelector("#playlist-header")
            if (scrollTop >= playlistHeader.offsetHeight) {
                playlistHeader.classList.add("sticky", "top-10", "bg-black-secondary")
            } 
        }
    })

    window.addEventListener("popstate", (event) => {
        loadSections(event.state)
    })
})