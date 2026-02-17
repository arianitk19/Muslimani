// theme-engine.js
const THEMES = {
    light: { bg: '#f8fafc', glass: 'rgba(0,0,0,0.03)', border: 'rgba(0,0,0,0.08)', text: '#020617' },
    dark:  { bg: '#020617', glass: 'rgba(255,255,255,0.03)', border: 'rgba(255,255,255,0.08)', text: '#ffffff' },
    oled:  { bg: '#000000', glass: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)', text: '#ffffff' }
};

function applyGlobalTheme() {
    const mode = localStorage.getItem('pd_theme_mode') || 'dark';
    const t = THEMES[mode];

    document.documentElement.style.setProperty('--bg', t.bg);
    document.documentElement.style.setProperty('--glass', t.glass);
    document.documentElement.style.setProperty('--border', t.border);
    document.body.style.color = t.text;
    
    // Ndrysho ngjyrën e status bar në iOS/Android
    const metaTheme = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
    if(metaTheme) metaTheme.content = (mode === 'light' ? 'default' : 'black-translucent');
}

// Dëgjo për ndryshime nga faqet e tjera
window.addEventListener('storage', (e) => {
    if (e.key === 'pd_theme_mode') applyGlobalTheme();
});

// Aplikoje sapo të ngarkohet faqja
document.addEventListener('DOMContentLoaded', applyGlobalTheme);
applyGlobalTheme(); // Ekzekutohet menjëherë për të shmangur "shkëndijën" e bardhë
