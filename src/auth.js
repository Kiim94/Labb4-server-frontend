//token sparas tillfälligt i sessionStorage. SessionStorage slutar vara giltig när man stänger webbläsare/fönstret
export function setToken(token){
    sessionStorage.setItem("token", token);
}

//hämta token från sessionStorage
export function getToken(){
    return sessionStorage.getItem("token");
}

//tar bort token från sessionStorage (användare loggas ut)
export function logout(){
    sessionStorage.removeItem("token");
}