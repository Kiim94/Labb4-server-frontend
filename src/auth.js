//js för authentication: skapa, spara, radera token
//token för att visa att användaren är inloggad/kan se sidor endast tillgängliga när man är inloggad

//token sparas tillfälligt i sessionStorage. 
//token i sessionStorage slutar vara giltig när man stänger webbläsare/fönstret
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