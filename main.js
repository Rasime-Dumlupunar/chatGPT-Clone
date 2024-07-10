//! HTML den gelenler
const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-btn");
const defaultText = document.querySelector(".default-text");
const chatContainer = document.querySelector(".chat-container");
const themeButton = document.querySelector("#theme-btn");
const deleteButton = document.querySelector("#delete-btn");


let userText = null;
//* Gönderdiğimiz HTML ve class ismine göre bize bir HTML oluşturur.
const createElement = (html, className) => {
    //*Yeni bir div oluşturur.
    const chatDiv = document.createElement("div");
    //* Bu oluşturduğumuz div'e chat ve dışardan parametre olarak gelen class'ı ver.
    chatDiv.classList.add("chat", className);
    //* Oluşturduğumuz div'in içerisine dışardan parametre olarak gelen html parametresini ekle

    chatDiv.innerHTML = html; 

    return chatDiv;
};

const getChatResponse = async (incomingChatDiv) => {
    //*API'dan gelecek cevabı içerisine aktaracağım bir P etiketi oluşturduk.
    const pElement = document.createElement("p");   
    console.log(pElement);
    //* 1. adım: URL'i tanımla
    const url = 'https://rapidapi.com/yourdevmail/api/chatgpt-ai-chat-bot';
    //* 2. adım : options'u tanımla
    const options = {
        method: 'POST', //*Atacağımız isteğin tipidir.
        //* API KEYİMİZ BULUNUR.
        headers: {
            'x-rapidapi-key': 'ec7ab83db9mshfbdb92ab23b71acp165f45jsn15ea2057d114',
            'x-rapidapi-host': 'chatgpt-42.p.rapidapi.com',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify ({ // JSON.stringify ekleyerek options kısmına json formatına çeviriyoruz.
            messages: [
                {
                    role: 'user',
                    content: `${userText}`
                }
            ],
            system_prompt: '',
            temperature: 0.9,
            top_k: 5,
            top_p: 0.9,
            max_tokens: 256,
            web_access: false,
        }),
    };
    /*3. API'ye istek at
    fetch(url, options)
    //* gelen cevabı yakala ve json'a çevir
    .then((res) => (res.json()))
    //*json'a çevniylix veriyi yakalayıp işlemler gerçekleştirebiliriz.
    .then((data) => console.log(data.result))
    //* hata varsa yakalar.
    .catch((error) => console.error(error))
    */

    try {
        //*API'ye url'i ve option'u kullanarak istek at ve bekle
        const response = await fetch(url, options);
        //* gelen cevabı jsona çevir ve bekle
        const result = await response.json();
        //* API'den gelen cevabı oluşturduğumuz P etiketinin içerisine aktardık.
        pElement.innerHTML = result.result;
    } catch (error) {
        console.log(error);        
    }

    console.log(incomingChatDiv);
    //*animasyonu kaldırabilmek için querySelector ile seçtik ve ekrandan remove ile kaldırdık.
    incomingChatDiv.querySelector(".typing-animation").remove();
    //* apı'den gelen cevabı ekrana aktarabilmek için chat-detailsi seçip bir değişkene aktardık.
    // const detailDiv = incomingChatDiv.querySelector(".chat-details");
    // bu detail içerisine oluşturduğumuz pElement etiketini aktardık.
    // detailDiv.appendChild(pElement); /// bu 2 satırı yazmak yerine aşağıdaki tek satır ile işimizi basitleştirdik.
    

    incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
    chatInput.value = null;
};

const showTypingAnimation = () => {
    const html = `
            <div class="chat-content">
                <div class="chat-details">
                    <img src="./images/openai-chatgpt-logo-icon-free-png.webp" alt="">
                    <div class="typing-animation">
                        <div class="typing-dot" style="--delay:0.2s"></div>
                        <div class="typing-dot" style="--delay:0.3s"></div>
                        <div class="typing-dot" style="--delay:0.4s"></div>
                    </div>
                </div>
            </div>
    `;

    const incomingChatDiv = createElement(html, "incoming");
    chatContainer.appendChild(incomingChatDiv);
    getChatResponse(incomingChatDiv);    
};

const handleOutGoingChat = () => {
    userText = chatInput.value.trim(); //* Inputun içerisindeki değeri al 
    //* ve fazladan bulunan boşlukları sil.

//* İnputun içerisinde veri yoksa fonksiyonu return ile burada durdurur.
    if (!userText)  {
        alert("Bir veri giriniz!!!")
        return;
        
    }
    const html = ` 
    <div class="chat-content">
        <div class="chat-details">
            <img src="./images/164165677.jpg" alt="">
            <p></p>
        </div>
    </div> 
    `;
    //* Kullanıcının mesajını içeren bir div oluştur ve bunu chatContainer yapısına ekle.
    const outgoingChatDiv = createElement(html, "outgoing");
    defaultText.remove(); //* başlangıçta gelen varsayılan yazıyı kaldırdık.
    outgoingChatDiv.querySelector("p").textContent = userText;
    chatContainer.appendChild(outgoingChatDiv);
    setTimeout(showTypingAnimation, 500);
};

//! Olay izleyicileri
sendButton.addEventListener("click", handleOutGoingChat);
//* Textarea içerisinde klavyeden herhangi bir tuşa bastığınızda bu olay izleyicisi çalışır.

chatInput.addEventListener("keydown", (e) => {
    //* Klavyeden Enter tuşuna basıldığı anda handleOutGoingChat fonksiyonunu çalıştırır.
    if(e.key === "Enter") {
        handleOutGoingChat();
    }
});

//* themeButton'a her tıkladığımızda body'ye light mode class'ını ekle ve çıkar.
themeButton.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    //* body light-mode classını içeriyorsa themeButton içerisindeki
    //* yazıyı dark_mode yap. İçermiyorsa light-mode yap
    themeButton.innerHTML = document.body.classList.contains("light-mode") 
    ? "dark_mode" 
    : "light_mode";
});

//* Sil butonuna tıkladığımızda chat-container div'ini sil ve yerine defaultText'i aktar.
deleteButton.addEventListener("click", () => {
    //* confirm ile ekrana bir mesaj bastırdık. Confirm bize true ve false değer döndürür.
    //* tamam tuşuna basıldığında TRUE döndürür.
    //* iptal tuşuna basıldığında FALSE döndürür.
    if(confirm("Tüm sohbetleri silmek istediğinize emin misiniz?")) {
        chatContainer.remove();
    }

    const defaultText = `
    <div class="default-text">
        <h1>ChatGPT Clone</h1>
    </div>
    <div class="chat-container"></div>
    <div class="typing-container">
        <div class="typing-content">
            <div class="typing-textarea">
                <textarea
                id="chat-input"
                placeholder="Aratmak istediğiniz veriyi giriniz..."
                ></textarea>
                <span class="material-symbols-outlined" id="send-btn"> send </span>
            </div>
            <div class="typing-controls">
                <span class="material-symbols-outlined" id="theme-btn">
                light_mode
                </span>
                <span class="material-symbols-outlined" id="delete-btn">
                delete
                </span>
            </div>
        </div>
    </div>
    `;

    document.body.innerHTML = defaultText;    
});


