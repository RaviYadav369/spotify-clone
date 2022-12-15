export const ACCESS_TOKEN = "ACCESS_TOKEN"
export const TOKEN_TYPE = "TOKEN_TYPE"
export const EXPIRE_IN = "EXPIRE_IN"
export const LOADED_TRACKS ="LOADED_TRACKS"

const APP_URL = import.meta.env.VITE_APP_URL;
export const ENDPOINT = {
    userInfo: "me",
    featurePlaylist :"browse/featured-playlists?limit=5",
    toplist:"browse/categories/toplists/playlists?limit=10",
    playlist :"playlists",
    userPlaylist:'me/playlists'
}
export const logout = () => {
    localStorage.removeItem(ACCESS_TOKEN)
    localStorage.removeItem(TOKEN_TYPE)
    localStorage.removeItem(EXPIRE_IN)
    window.location.href = `${APP_URL}`
}

export const setItemIntLocalStorage = (key,value)=> localStorage.setItem(key,JSON.stringify(value))
export const getItemFromtLocalStorage = (key)=> JSON.parse(localStorage.getItem(key))

export const SECTIONTYPE ={
    DASHBOARD :"DASHBOARD",
    PLAYLIST:"PLAYLIST"
}