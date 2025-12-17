document.addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting){
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.slide-up-text').forEach(el => {
        observer.observe(el);
    });







/*************************/

const items = document.querySelectorAll('.gallery-item');
let index = 0;
let autoTimer;

// ====== ГАЛЕРЕЯ ======
function updateGallery() {
    items.forEach((item) => {
        item.classList.remove(
            'gallery-item-1', 'gallery-item-2', 'gallery-item-3',
            'gallery-item-4', 'gallery-item-5'
        );
        item.style.opacity = "1";
    });

    const i1 = (index - 2 + items.length) % items.length;
    const i2 = (index - 1 + items.length) % items.length;
    const i3 = index;
    const i4 = (index + 1) % items.length;
    const i5 = (index + 2) % items.length;

    items[i1].classList.add('gallery-item-1');
    items[i2].classList.add('gallery-item-2');
    items[i3].classList.add('gallery-item-3');
    items[i4].classList.add('gallery-item-4');
    items[i5].classList.add('gallery-item-5');
}

// ====== АВТОПРОКРУТКА ======
function startAuto() {
    autoTimer = setInterval(() => {
        index = (index + 1) % items.length;
        updateGallery();
    }, 3000);
}

function stopAuto() {
    clearInterval(autoTimer);
}

updateGallery();
startAuto();


// ====== СВАЙП / DRAG ======
let startX = 0;
let isDragging = false;

const container = document.querySelector('.gallery-container');

// Мышь
container.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    stopAuto();
});

document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
});

document.addEventListener('mouseup', (e) => {
    if (!isDragging) return;
    isDragging = false;

    const delta = e.clientX - startX;

    if (Math.abs(delta) > 50) {
        if (delta < 0) {
            // свайп влево → следующий
            index = (index + 1) % items.length;
        } else {
            // свайп вправо → предыдущий
            index = (index - 1 + items.length) % items.length;
        }
        updateGallery();
    }

    startAuto();
});

// Сенсор
container.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
    stopAuto();
});

container.addEventListener('touchmove', (e) => {
    // будем использовать только конечное событие
});

container.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    isDragging = false;

    const endX = e.changedTouches[0].clientX;
    const delta = endX - startX;

    if (Math.abs(delta) > 50) {
        if (delta < 0) {
            index = (index + 1) % items.length;
        } else {
            index = (index - 1 + items.length) % items.length;
        }
        updateGallery();
    }

    startAuto();
});


/*********************************************/
const URL_APP = "https://script.google.com/macros/s/AKfycbyp9OA1i_dINPQSugFVKoZeeAnTJPJHZkvwdbHXLaOJIItx6KnbnUbLuZD_GLeJ_QW_lg/exec"

// находим форму в документе
const form = document.querySelector("#form");

// указываем адрес отправки формы (нужно только в начале примера)
form.action = URL_APP;

// вспомогательная функция проверки заполненности формы
function isFilled(details) {
    const { name, attend, phone, drink } = details;
    if (!name) return false;
    if (!attend) return false;
    if (!phone) return false;
    if (!drink) return false;
    return true;
}

// навешиваем обработчик на отправку формы
form.addEventListener("submit", async (ev) => {
    // отменяем действие по умолчанию
    ev.preventDefault();

    // получаем ссылки на элементы формы
    const name = document.querySelector("[name=name]");
    const attend = document.querySelector("[name=attend]");
    const phone = document.querySelector("[name=phone]");
    const name_pair = document.querySelector("[name=name_pair]");
    const allergy = document.querySelector("[name=allergy]");
    const drinks = document.querySelectorAll("[name=drink]:checked");

    if (drinks.length === 0) {
        alert("Пожалуйста, выберите хотя бы один напиток");
    return;

    if(phone.length > 12)
        alert("Некорректная длина номера телефона");
    return;
}

    const drinkValues = Array.from(drinks).map(el => el.value);

    // собираем данные из элементов формы
    let details = {
        name: name.value.trim(),
        attend: attend.value.trim(),
        phone: phone.value.trim(),
        name_pair: name_pair.value.trim(),
        allergy: allergy.value.trim(),
        drink: drinkValues.join(", "), // строка: "Водка, Вино"
    };

// если поля не заполнены - прекращаем обработку
    if (!isFilled(details)) return;

    // подготавливаем данные для отправки
    let formBody = [];

    for (let property in details) {
        // кодируем названия и значения параметров
        let encodedKey = encodeURIComponent(property);
        let encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    // склеиваем параметры в одну строку
    formBody = formBody.join("&");

    const decoded = decodeURIComponent(formBody);

    console.log("Отправляемые данные:");
    console.log(decoded);
    console.log("details:", details);



    // выполняем отправку данных в Google Apps
    const result = await fetch(URL_APP, {
        method: "POST",
        headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        //cors: "no-cors", <- это неправильно
        mode: "cors", //<- оставим по умолчанию
        body: formBody,
    })
        .then((res) => res.json())
        .catch((err) => alert("Ошибка!"))
        .then((res) => console.log(res));
      
     if( result.type === 'success' ) {
        form.reset();
        alert('Спасибо за заявку!')
     }
     if( result.type === 'error' ) {            
        alert(`Ошибка( ${result.errors}`)
     }


    });



    
});














