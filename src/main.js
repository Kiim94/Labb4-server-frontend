import './style.css'
import { setToken, getToken, logout } from "./auth.js"
import { initLogin, initRegister } from "./login.js";

//alla element som interageras med
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const registerBtn = document.getElementById("registerBtn");
const output = document.getElementById("output");
const deleteUser = document.getElementById("delete");

//ladda detta automatiskt vid start
window.addEventListener("DOMContentLoaded", () => {
  
  //upptäckte att tidigare, utan path nedan, så laddades dessa på ALLA sidor
  //visade bland annat login + användaruppgifter när extra sida lades till - ajaj
  const path = window.location.pathname;
  const token =getToken();
  if(path.includes("index.html") || path === "/"){
    initLogin();
  }
  //om man skulle försöka ta sig in på länken nedan så kontrolleras token.
  //är man inloggad: fungerar. Ej inloggad, redirect till index.html
  if(path.includes("user-only-page.html")){
    if(!token){
      window.location.href ="index.html";
      return;
    }
  }
  if(path.includes("register.html")){
    initRegister();
  }
  updateUI();
  if(document.getElementById("profile")){
    loadProfile();    
  }
})

//logga ut -> man skickas till startsida, utloggad
if(logoutBtn){
  logoutBtn.addEventListener("click", () => {
    logout();
    window.location.href ="index.html";
  })
}

//registrera användare -> gå till ny sida för registrering
if(registerBtn){
  registerBtn.addEventListener("click", () => {
    window.location.href = "register.html";
  })
}

//uppdater ui så man ser om man är inloggad eller inte
function updateUI(){
  const token = getToken();

  if(token){
    if(loginBtn) loginBtn.classList.add("hidden");
    if(logoutBtn) logoutBtn.classList.remove("hidden");
  }else{
    if(loginBtn) loginBtn.classList.remove("hidden");
    if(logoutBtn) logoutBtn.classList.add("hidden");
  }
}


async function loadProfile() {
    const token = getToken();
    const profile =document.getElementById("profile");
    
    if(!token){
      //output = på index.html: visa om man är inloggad eller ej
      if(output){
        output.classList.add("error");
        output.innerText = "Inte inloggad";
      }
        return;
    }
    if(!profile) return;

    try{
      //hämta data om profil
        const response = await fetch("https://labb4-webbserver.onrender.com/api/auth/profile", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            }
        });
        //profil data/användardata returneras i json()
        const data = await response.json();

        //om ingen respons, skriv ut:
        if(!response.ok){
          if(output){
            output.classList.add("error");
            output.innerText = data.error || "Kunde inte hämta profil";
          }
            return;
        }
        const user = data.user;
        //fixa så datum för skapande av användarkonto syns i år, månad, dag
        const createDate = new Date(data.user.createdAt).toLocaleDateString("sv-SE");
        //lite info om användaren: användarnamn, email, när användarkontot skapades
        profile.innerHTML = `
        <h2>Din profil</h2>
        <p><strong>Username:</strong> ${user.username}</p>
        <p><strong>Created:</strong> ${createDate}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        `;
        if(output){
          output.innerText = "";
        }
    }catch(err){
      if(output){
        output.classList.add("error");
        output.innerText = "Serverfel";
      } 
    }
}
//radera användare
if(deleteUser){
  deleteUser.addEventListener("click", deleteProfile);
  async function deleteProfile(){
    if(!confirm("Är du säker på att du vill radera ditt konto?")){
      return;
    }
    const token = getToken();
    try{
      const response = await fetch("https://labb4-webbserver.onrender.com/api/auth/user", {
      method: "DELETE",
      headers: {
        "Authorization": "Bearer " + token
      }
    });
    console.log(response.status);
    const data = await response.json();
    console.log(data);
    

    if(!response.ok){
      if(output){
        output.classList.add("error");
        output.innerText = "Kunde inte radera kontot!";
      }
      return;
    }
    }catch(err){
      console.log("Serverfel:", err);
      if(output){
        output.classList.add("error");
        output.innerText = "Serverfel";
      }
    }
    
    logout();
    window.location.href = "index.html"
  }
}