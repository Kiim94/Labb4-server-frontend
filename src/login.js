//importera sparad token från auth.js
import { setToken } from "./auth.js";

//element från index.html: visar meddelanden till användaren.
const output = document.getElementById("output");

//funktion för inloggning
export function initLogin(){
    const loginBtn = document.getElementById("loginBtn");
    //om ingen loginBtn finns på sidan, så går denna funktion inte att köra
    if(!loginBtn){
        return;
    }

    //lyssna efter knapptryck. Får värdena som användare skriver in
    loginBtn.addEventListener("click", async () => {
        try{
            const usernameLogin = document.getElementById("username").value.trim();
            
            //osäker: trim på lösenord? kan lösenord ha mellanslag? Behåller detta
            const passwordLogin = document.getElementById("password").value;
            
            //om lösenord eller användarnamn är fel och om output finns på sidan: visa felmeddelande
            if(!usernameLogin || !passwordLogin){
                if(output){

                    //output är på index.html sidan. 
                    //Visa meddelanden till användaren vid t.ex. lyckad inloggning eller om ngt gått snett
                    output.classList.remove("error", "success");
                    output.classList.add("error");
                    output.innerText = "Fyll i både användarnamn och lösenord!";
                }
                return;
            }
            //pga render, en laddnings status
            if (output){
                output.classList.remove("error", "success");
                output.classList.add("success");
                output.innerText = "Loggar in..."
            }

            const response = await fetch("https://labb4-webbserver.onrender.com/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },

                //gör strängar av data, skicka med POST
                body: JSON.stringify({ username: usernameLogin, password: passwordLogin })
            });
            //respons från api sparas i variabeln data. 
            const data = await response.json();
            console.log("Svar från api:", data)

            //om man får data.token, mao svar från backend, så går det att logga in
            if(data.token){
                console.log("Login ok")
                setToken(data.token);
                window.location.href = "show-login.html";
            }else{
                //annars, om output finns, visa felet
                if(output){
                    output.classList.remove("error", "success");
                    output.classList.add("error");
                    output.innerText = data.error || "Fel login, försök igen!";
                }
            }
        //om ngt annat skulle gå fel:
        }catch(err){
            console.log(err);
            //om output finns, visa vad felet är
            if(output){
                output.classList.remove("error", "success");
                output.classList.add("error");
                output.innerText = "Kan inte nå servern! Försök igen senare!";
            }
        }   
    });
}

//funktion för att registrera ny användare
//ungefär samma procedur som ovan
export function initRegister(){
    console.log("Initregistre körs!")
    //const btn = document.getElementById("submitReg");
    const regForm = document.getElementById("regForm");
    if(!regForm){
        return;
    }
    //preventDefault() pga att det är ett formulär
    regForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        //de värden som användaren skriver in sparas i variabler och trimmas från whitespace
        const username = document.getElementById("username").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        
        //showText = på register.html sidan. För att visa meddelanden till användaren
        const showText = document.getElementById("showText");
        showText.innerText = "";

        if(!username|| !email|| !password){
            showText.classList.remove("error", "success");
            showText.classList.add("error");
            showText.innerText = "Alla fält måste vara ifyllda!"
            return;
        }

        //skicka information till webbserver med POST: ny användare skapas
        const res = await fetch("https://labb4-webbserver.onrender.com/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password })
        });
        const data = await res.json();

        
        if(!res.ok){
            showText.classList.remove("error", "success");
            showText.classList.add("error");
            showText.innerText = data.error || "Användare kunde inte skapas. Försök igen!";
            return;
        }
        showText.classList.remove("error", "success");
        showText.classList.add("success");
        showText.innerText = "Användare har skapats!";
        //kort fördröjning innan tillbaka till start så användare hinner se att användare skapats
        setTimeout(() => {
            window.location.href = "index.html";
        }, 1000);
    })
}