const CLIENT_ID = "566d0cf5477d4f48831a79761bb96c37"
const scopes = "user-top-read user-follow-read playlist-read-private user-library-read"
const REDIRECT_URL = "http://localhost:3000/login/login.html";
const App_URL = "http://localhost:3000"
const ACCESS_TOKEN_KEY = "accessToken"

const authoriseUser = () => {
    const url = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${REDIRECT_URL}&scope=${scopes}&show_dialog=true`;
    window.open(url, "login", "width=800,height=600");

}

document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.querySelector('#login-to-spotify')
    loginButton.addEventListener("click", authoriseUser)

})

window.setItemsInLocalStorage = ({ accessToken, tokenType, expireIn }) => {
    localStorage.setItem("accessToken", accessToken)
    localStorage.setItem("tokenType", tokenType)
    localStorage.setItem("expire-in", expireIn)
    window.location.href=`${App_URL}`

}

window.addEventListener('load', () => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (accessToken) {
        console.log(accessToken);
        window.location.href = `${App_URL}/dashboard/dashboard.html`
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