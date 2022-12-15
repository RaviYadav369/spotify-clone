import { fetchRequest } from "../api";
import { ENDPOINT, getItemFromtLocalStorage, LOADED_TRACKS, logout, SECTIONTYPE, setItemIntLocalStorage } from "../common";

const audio = new Audio()
let displayName;

let progressInreval;

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
    const response = await fetchRequest(endpoint)
   
    const {items}  = response.playlists  ? response.playlists : response.albums 

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
    loadPlaylist(ENDPOINT.newReleases, "new-released")
    loadPlaylist(ENDPOINT.toplist, "top-playlist-items")
}

const fillContentForDashboard = () => {

    const playlistMap = new Map([["Featured", "featured-playlist-items"], ["New Playlist", "new-released"], ["Top Playlist", "top-playlist-items"]])
    const coverElement = document.querySelector("#cover-content")
    coverElement.innerHTML = `
      <section class="pt-4" >
      <h1 class="text-6xl" >Hello ${displayName}</h1>
      </section>
    `
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

const formatTime = (duration) => {
    const min = Math.floor(duration / 60_000);
    const sec = ((duration % 6000) / 1000).toFixed(0);
    const formattedTime = sec == 60 ?
        min + 1 + ":00" : min + ":" + (sec < 10 ? "0" : "") + sec;
    return formattedTime
}

const onTrackSelection = (id, event) => {
    document.querySelectorAll("#tracks .track").forEach(trackItem => {
        if (trackItem.id === id) {
            trackItem.classList.add("bg-gray", "selected")
        }
        else {
            trackItem.classList.remove("bg-gray", "selected")
        }
    })
}

// const timeLine = document.querySelector("#timeline")
const updateIconForPlayMode = (id) => {
    const playButton = document.querySelector("#play")
    playButton.querySelector("span").textContent = "pause_circle"
    const playButtonInTrack = document.querySelector(`#play-track-${id}`)
    console.log(playButtonInTrack);
    if (playButtonInTrack) {

        playButtonInTrack.textContent = "pause_circle"
    }

}

const onAudioMetaDataLoaded = (id) => {
    const totalSongDuration = document.querySelector("#total-duration")

    totalSongDuration.textContent = `0:${audio.duration.toFixed(0)}`
    // updateIconForPlayMode(id);
    // pausedAudio(id)

}

const updateIconForPauseMode = (id) => {
    const playButton = document.querySelector("#play")
    playButton.querySelector("span").textContent = "play_circle"
    const playButtonInTrack = document.querySelector(`#play-track-${id}`)
    console.log(playButtonInTrack);
    if (playButtonInTrack) {

        playButtonInTrack.textContent = "play_circle"
    }

}

const togglePlaySong = () => {
    if (audio.src) {

        if (audio.paused) {
            audio.play()

        }
        else {
            audio.pause()
        }
    }

}

const findCurrentTrack = () => {
    const audioControl = document.querySelector("#audio-control")
    const trackId = audioControl.getAttribute("data-track-id")
    if (trackId) {
        const loadedTracks = getItemFromtLocalStorage(LOADED_TRACKS)
        const currentTrackIndex = loadedTracks?.findIndex(trk => trk.id === trackId)
        return { currentTrackIndex, tracks: loadedTracks }
    }
    return null
}

const playNextTrack = () => {
    const { currentTrackIndex = -1, tracks = null } = findCurrentTrack() ?? {}
    if (currentTrackIndex > -1 && currentTrackIndex < tracks.length - 1) {
        onPlayTrack(null, tracks[currentTrackIndex + 1])
    }
}
const playPreviousTrack = () => {
    const { currentTrackIndex = -1, tracks = null } = findCurrentTrack() ?? {}
    if (currentTrackIndex > 0) {
        onPlayTrack(null, tracks[currentTrackIndex - 1])
    }
}

const onPlayTrack = (event, { image, artistsName, name, duration, previewUrl, id }) => {
    console.log(image, artistsName, name, duration, previewUrl);
    if (event?.stopPropogation) {
        event.stopPropogation()
    }
    if (audio.src === previewUrl) {
        togglePlaySong()

    }
    else {
        // console.log(document.querySelectorAll("[data-play]"));
        // document.querySelectorAll("[data-play]").forEach(btn => btn.setAttribute("data-play", "false"))

        const nowPlayingSongImage = document.querySelector("#now-playing-image")
        const nowPlayingSong = document.querySelector("#now-playing-song")
        const nowPlayingSongArtists = document.querySelector("#now-playing-artists")
        const audioControl = document.querySelector("#audio-control")
        const songInfo = document.querySelector("#song-info")

        audioControl.setAttribute("data-track-id", id)
        nowPlayingSongImage.src = image.url;
        nowPlayingSong.textContent = name
        nowPlayingSongArtists.textContent = artistsName
        audio.src = previewUrl;
        // controller.abort()
        // audio.removeEventListener("loadedmetadata", () => onAudioMetaDataLoaded(id))
        // audio.addEventListener("loadedmetadata", () => onAudioMetaDataLoaded(id))
        // playButton.addEventListener("click", () => pausedAudio(id))
        audio.play();
        songInfo.classList.remove("invisible")

    }
}

const loadPlaylistTracks = ({ tracks }) => {
    const trackSection = document.querySelector("#tracks")
    let trackNo = 1;
    const loadedTracks = [];
    for (let trackitem of tracks.items.filter(items => items.track.preview_url)) {
        let { id, artists, name, album, duration_ms: duration, preview_url: previewUrl } = trackitem.track
        let track = document.createElement("section")
        track.className = "grid track p-1 items-center track justify-items-start rounded-md hover:bg-light-black grid-cols-[50px_2fr_1fr_50px] gap-4 text-secondary"
        let image = album.images.find(img => img.height === 64)
        track.id = id;
        let artistsName = Array.from(artists, artist => artist.name).join(", ")

        track.innerHTML = `<p class="relative flex w-full items-center justify-center"><span class="track-number">${trackNo++}</span></p>
        <section class="grid grid-cols-[auto_1fr] place-items-center gap-1">
          <img class="h-8 w-8" src="${image.url}" alt="${name}" />
          <article class="flex flex-col justify-center">
            <h2 class="text-primary song-title text-xl line-clamp-1">${name}</h2>
            <p class="text-sm line-clamp-1">${artistsName}</p>
          </article>
        </section>
        <p>${album.name}</p>
        <p>${formatTime(duration)}</p>
        `
        track.addEventListener("click", (event) => onTrackSelection(id, event))
        const playButton = document.createElement("button")
        playButton.id = `play-track-${id}`
        playButton.className = "play w-full absolute left-0 text-lg invisible material-symbols-outlined"
        playButton.textContent = "play_arrow"
        playButton.addEventListener("click", (event) => onPlayTrack(event, { image, artistsName, name, duration, previewUrl, id }))
        track.querySelector("p").appendChild(playButton)
        trackSection.appendChild(track)

        loadedTracks.push({ id, artistsName, name, album, previewUrl, duration, image })
    }
    setItemIntLocalStorage(LOADED_TRACKS, loadedTracks)
}

const loadUserProfile = () => {

    return new Promise(async (resolve, reject) => {

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
        resolve({ displayName, images })
    })


}


const onContentScroll = (event) => {

    const { scrollTop } = event.target;
    const header = document.querySelector(".header");
    const coverElement = document.querySelector("#cover-content");
    const totalHeight = coverElement.offsetHeight;
    const fiftyPercentHeight = totalHeight / 2;
    const coverOpacity = 100 - (scrollTop >= totalHeight ? 100 : (scrollTop / totalHeight) * 100);
    coverElement.style.opacity = `${coverOpacity}%`;

    let headerOpacity = 0;
    // once 50% of cover element is crossed, start increasing the opacity
    if (scrollTop >= fiftyPercentHeight && scrollTop <= totalHeight) {
        let totatDistance = totalHeight - fiftyPercentHeight;
        let coveredDistance = scrollTop - fiftyPercentHeight;
        headerOpacity = (coveredDistance / totatDistance) * 100;
    } else if (scrollTop > totalHeight) {
        headerOpacity = 100;
    } else if (scrollTop < fiftyPercentHeight) {
        headerOpacity = 0;
    }
    header.style.background = `rgba(0 0 0 / ${headerOpacity}%)`

    if (history.state.type === SECTIONTYPE.PLAYLIST) {
        const playlistHeader = document.querySelector("#playlist-header");
        if (headerOpacity >= 60) {
            playlistHeader.classList.add("sticky", "bg-black-secondary", "px-8");
            playlistHeader.classList.remove("mx-8");
            playlistHeader.style.top = `${header.offsetHeight}px`;

        } else {
            playlistHeader.classList.remove("sticky", "bg-black-secondary", "px-8");
            playlistHeader.classList.add("mx-8");
            playlistHeader.style.top = `revert`;

        }

    }

}

const fillContentForPlaylist = async (playlistId) => {
    const playlist = await fetchRequest(`${ENDPOINT.playlist}/${playlistId}`)
    const { name, description, images, tracks } = playlist;
    const coverElement = document.querySelector("#cover-content")
    coverElement.innerHTML = `
      <img class="h-24 object-contain w-24" src="${images[0].url}" alt="${name}" />
      <section >
      
      <h3 class="text-4xl " id="playlist-name">${name}</h3>
      <p id="playlist-artists" class="pt-1">${tracks.items.length} Songs</p>
      <p id="playlist-desc" class="text-secondary pt-1">${description}</p>
      </section>
    `
    const pageContent = document.querySelector("#page-content")
    pageContent.innerHTML = `
    <header class="px-8 z-10 py-1 text-white font-semibold text-xl border-b-2 bg-light-black" id="playlist-header">
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
    document.querySelector(".content").removeEventListener("scroll", onContentScroll);
    document.querySelector(".content").addEventListener("scroll", onContentScroll);
}

const onUserPlaylistClick = (id) => {
    const section = { type: SECTIONTYPE.PLAYLIST, playlistId: id }
    history.pushState(section, "", `/dashboard/playlist/${id}`)
    loadSections(section)
}

const loaduserPlaylists = async () => {
    const playlist = await fetchRequest(ENDPOINT.userPlaylist)
    console.log(playlist);
    const userPlaylistSection = document.querySelector("#user-playlists > ul")
    userPlaylistSection.innerHTML = "";
    for (let { name, id } of playlist.items) {
        const li = document.createElement("li");
        li.textContent = name;
        li.className = "cursor-pointer hover:text-primary "
        li.addEventListener("click", () => { onUserPlaylistClick(id) })
        userPlaylistSection.appendChild(li)
    }
}

document.addEventListener("DOMContentLoaded", async () => {

    const volume = document.querySelector("#volume")
    const playButton = document.querySelector("#play")

    const songDurationCompleted = document.querySelector("#song-duration-completed")
    const songprogress = document.querySelector("#progress")
    const timeLine = document.querySelector("#time-line")
    const audioControl = document.querySelector("#audio-control")
    const next = document.querySelector("#next")
    const previous = document.querySelector("#prev")

    // ({ displayName } = await loadUserProfile())
    loadUserProfile()
    loaduserPlaylists()
    const section = { type: SECTIONTYPE.DASHBOARD };
    history.pushState(section, "", "")
    loadSections(section)

    document.addEventListener("click", () => {
        const profileMenu = document.querySelector("#profile-menu");
        if (!profileMenu.classList.contains("hidden")) {
            profileMenu.classList.add("hidden")
        }
    })

    audio.addEventListener("play", () => {
        const selectedSongId = audioControl.getAttribute("data-track-id")
        const tracks = document.querySelector("#tracks")
        const selectedTrack = tracks?.querySelector(`[id=" ${selectedSongId}"]`)
        const playlingTrack = tracks?.querySelector("section.playing")
        if (playlingTrack?.id !== selectedTrack?.id) {
            playlingTrack?.classList.remove("playing")
        }
        selectedTrack?.classList.add("playing")
        progressInreval = setInterval(() => {
            if (audio.paused) {
                return
            }
            songDurationCompleted.textContent = `${audio.currentTime.toFixed(0) < 10 ? "0:0" + audio.currentTime.toFixed(0) : "0:" + audio.currentTime.toFixed(0)}`
            songprogress.style.width = `${(audio.currentTime / audio.duration) * 100}%`
        }, 100)
        updateIconForPlayMode(selectedSongId)
    })

    audio.addEventListener("pause", () => {
        if (progressInreval) {
            clearInterval(progressInreval)

        }
        const selectedSongId = audioControl.getAttribute("data-track-id")
        updateIconForPauseMode(selectedSongId)
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
        if (history.state.type === SECTIONTYPE.PLAYLIST) {
            const playlistHeader = document.querySelector("#playlist-header")
            if (scrollTop >= playlistHeader.offsetHeight) {
                playlistHeader.classList.add("sticky", "top-10", "bg-black-secondary")
            }
        }
    })

    // audio.removeEventListener("loadedmetadata", () => onAudioMetaDataLoaded(id))
    audio.addEventListener("loadedmetadata", onAudioMetaDataLoaded)
    playButton.addEventListener("click", togglePlaySong)

    volume.addEventListener("change", () => {
        audio.volume = volume.value / 100
    })

    timeLine.addEventListener("click", (e) => {
        const timeLineWidth = window.getComputedStyle(timeLine).width;
        const timeToSeek = (e.offsetX / parseInt(timeLineWidth)) * audio.duration;
        audio.currentTime = timeToSeek;
        songprogress.style.width = `${(audio.currentTime / audio.duration) * 100}%`
    }, false)

    next.addEventListener("click", playNextTrack)
    previous.addEventListener("click", playPreviousTrack)

    window.addEventListener("popstate", (event) => {
        loadSections(event.state)
    })
})