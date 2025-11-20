// Инициализация Telegram Web App
const tg = window.Telegram.WebApp;

// Глобальное состояние приложения
let appState = {
    currentUser: null,
    currentTab: 'feed',
    currentFilter: 'popular',
    posts: [],
    users: [],
    notifications: [],
    messages: []
};

// Инициализация приложения
function initApp() {
    tg.ready();
    tg.expand();
    tg.enableClosingConfirmation();
    
    // Получаем данные пользователя из Telegram
    const telegramUser = tg.initDataUnsafe.user;
    if (telegramUser) {
        appState.currentUser = {
            id: telegramUser.id,
            firstName: telegramUser.first_name,
            lastName: telegramUser.last_name || '',
            username: telegramUser.username || '',
            photo: `https://t.me/i/userpic/320/${telegramUser.username}.jpg` || ''
        };
    }
    
    // Загружаем моковые данные
    loadMockData();
    
    // Инициализируем интерфейс
    initNavigation();
    initFilters();
    renderFeed();
    
    console.log('Приложение инициализировано!', appState);
}

// Навигация по табам
function initNavigation() {
    const tabs = document.querySelectorAll('.tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.getAttribute('data-tab');
            
            // Убираем активный класс у всех табов
            tabs.forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Активируем выбранный таб
            tab.classList.add('active');
            document.getElementById(tabName).classList.add('active');
            appState.currentTab = tabName;
            
            // Загружаем контент для таба
            switch(tabName) {
                case 'feed':
                    renderFeed();
                    break;
                case 'profile':
                    renderProfile();
                    break;
                case 'messages':
                    renderMessages();
                    break;
                case 'notifications':
                    renderNotifications();
                    break;
            }
        });
    });
}

// Фильтры ленты
function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            appState.currentFilter = btn.getAttribute('data-filter');
            renderFeed();
        });
    });
}

// Загрузка моковых данных
function loadMockData() {
    // Загружаем посты
    appState.posts = window.mockData.posts;
    
    // Загружаем пользователей
    appState.users = window.mockData.users;
    
    // Загружаем уведомления
    appState.notifications = window.mockData.notifications;
    
    // Загружаем сообщения
    appState.messages = window.mockData.messages;
}

// Утилиты
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function formatTime(timestamp) {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diff = now - postTime;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 60) return `${minutes} мин назад`;
    if (hours < 24) return `${hours} ч назад`;
    if (days < 7) return `${days} дн назад`;
    return postTime.toLocaleDateString();
}

// Отправка данных в бота (для уведомлений)
function sendToBot(data) {
    if (tg.sendData) {
        tg.sendData(JSON.stringify(data));
    }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', initApp);
