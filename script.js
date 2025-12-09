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





const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting){
            entry.target.classList.add('visible');
            // Если нужно, чтобы анимация срабатывала только один раз:
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.2 // 20% элемента должны быть видны, чтобы сработало
});

// Выбираем все элементы с классом .slide-up-text
document.querySelectorAll('.slide-up-text').forEach(el => {
    observer.observe(el);
});