export default function Logout() {
    sessionStorage.removeItem("access_token");
    window.location.href = "/login";
    return null;
}