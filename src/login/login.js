
import { ACCESS_TOKEN, EXPIRE_IN, TOKEN_TYPE } from "../common"

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const scopes = "user-top-read user-follow-read playlist-read-private user-library-read";
const REDIRECT_URL = import.meta.env.VITE_REDIRECT_URL;
const APP_URL = import.meta.env.VITE_APP_URL;

const authoriseUser = () => {
    const url = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${REDIRECT_URL}&scope=${scopes}&show_dialog=true`;
    window.open(url, "login", "width=800,height=600");

}

document.addEventListener('DOMContentLoaded', () => {
    
    const loginButton = document.getElementById('login-to-spotify');
    loginButton.addEventListener("click", authoriseUser)

})

window.setItemsInLocalStorage = ({ accessToken, tokenType, expireIn }) => {
    localStorage.setItem(ACCESS_TOKEN, accessToken)
    localStorage.setItem(TOKEN_TYPE, tokenType)
    localStorage.setItem(EXPIRE_IN, (Date.now() +(expireIn*1000)))
    window.location.href=`${APP_URL}`

}

window.addEventListener('load', () => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    if (accessToken) {
        console.log(accessToken);
        window.location.href = `${APP_URL}/dashboard/dashboard.html`
    }

    if (window.opener !== null && !window.opener.closed) {
        alert("inside opener")
        window.focus();
        if (window.location.href.includes('error')) {
            window.close()
        }

        const { hash } = window.location;
        console.log(hash);
        const searchParams = new URLSearchParams(hash);
        const accessToken = searchParams.get("#access_token")

        const tokenType = searchParams.get("token_type")
        const expireIn = searchParams.get("expires_in")
        console.log(accessToken,tokenType, expireIn);
        if (accessToken) {
            window.close()
            window.opener.setItemsInLocalStorage({accessToken, tokenType, expireIn})
        }
        else {
            window.close()
        }
    }

})