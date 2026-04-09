// ==UserScript==
// @name         BetterFLVS
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Improve FLVS navigation and UI for mobile users.
// @author       DogeminerCE
// @match        https://*.flvs.net/*
// @match        https://flvs.instructure.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        dark_mode: GM_getValue('dark_mode', true),
        distraction_free: GM_getValue('distraction_free', true),
        bottom_nav: GM_getValue('bottom_nav', true),
    };

    const UI = {
        injectStyles: function() {
            const styles = `
                :root {
                    --bflvs-primary: #007bff;
                    --bflvs-bg: #ffffff;
                    --bflvs-text: #212529;
                    --bflvs-nav-bg: #f8f9fa;
                    --bflvs-card-bg: #ffffff;
                    --bflvs-border: #dee2e6;
                    --bflvs-fab-bg: #007bff;
                }

                [data-bflvs-theme="dark"] {
                    --bflvs-bg: #121212;
                    --bflvs-text: #e0e0e0;
                    --bflvs-nav-bg: #1e1e1e;
                    --bflvs-card-bg: #1e1e1e;
                    --bflvs-border: #333333;
                    --bflvs-fab-bg: #3700b3;
                }

                /* Mobile Optimizations */
                @media (max-width: 768px) {
                    /* Bottom Navigation Bar */
                    #bflvs-bottom-nav {
                        position: fixed;
                        bottom: 0;
                        left: 0;
                        width: 100%;
                        height: 60px;
                        background: var(--bflvs-nav-bg);
                        display: flex;
                        justify-content: space-around;
                        align-items: center;
                        box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
                        z-index: 10000;
                        border-top: 1px solid var(--bflvs-border);
                        padding-bottom: env(safe-area-inset-bottom);
                    }

                    .bflvs-nav-item {
                        text-align: center;
                        color: var(--bflvs-text);
                        text-decoration: none;
                        font-size: 10px;
                        flex: 1;
                        cursor: pointer;
                        border: none;
                        background: none;
                        padding: 0;
                    }

                    .bflvs-nav-item span {
                        display: block;
                        font-size: 20px;
                        margin-bottom: 2px;
                    }

                    /* Floating Action Button */
                    #bflvs-fab {
                        position: fixed;
                        right: 20px;
                        bottom: 80px;
                        width: 56px;
                        height: 56px;
                        background: var(--bflvs-fab-bg);
                        color: white;
                        border-radius: 50%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
                        z-index: 9999;
                        cursor: pointer;
                        font-size: 24px;
                    }

                    .bflvs-fab-menu {
                        position: fixed;
                        right: 20px;
                        bottom: 145px;
                        display: none;
                        flex-direction: column;
                        gap: 10px;
                        z-index: 9998;
                    }

                    .bflvs-fab-menu.active {
                        display: flex;
                    }

                    .bflvs-fab-item {
                        width: 45px;
                        height: 45px;
                        background: var(--bflvs-nav-bg);
                        color: var(--bflvs-text);
                        border-radius: 50%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                        text-decoration: none;
                    }

                    /* Content Cleanup & Navigation Hiding */
                    header, #header, .navbar, #toolbar, .nav-menu, .sidebar {
                        display: none !important;
                    }

                    #main, #content, .main-content {
                        margin: 0 !important;
                        padding: 10px !important;
                        padding-bottom: 80px !important;
                        width: 100% !important;
                    }
                }

                /* Reading Mode */
                .bflvs-reading-mode {
                    font-size: 19px !important;
                    line-height: 1.7 !important;
                    max-width: 800px !important;
                    margin: 0 auto !important;
                    padding: 20px !important;
                    font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important;
                }

                .bflvs-reading-mode img {
                    max-width: 100% !important;
                    height: auto !important;
                }

                /* Restore Button */
                .bflvs-restore-btn {
                    background: var(--bflvs-primary);
                    color: white;
                    border: none;
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 11px;
                    cursor: pointer;
                    margin-top: 5px;
                    display: block;
                }

                /* Global Dark Mode Filter */
                [data-bflvs-theme="dark"] {
                    filter: invert(1) hue-rotate(180deg);
                }

                [data-bflvs-theme="dark"] img, 
                [data-bflvs-theme="dark"] video, 
                [data-bflvs-theme="dark"] .bflvs-nav-item span,
                [data-bflvs-theme="dark"] #bflvs-fab,
                [data-bflvs-theme="dark"] #bflvs-bottom-nav {
                    filter: invert(1) hue-rotate(180deg);
                }

                [data-bflvs-theme="dark"] body {
                    background-color: #eee !important; /* Becomes dark after inversion */
                }
            `;
            GM_addStyle(styles);
        },

        initTheme: function() {
            if (CONFIG.dark_mode) {
                document.documentElement.setAttribute('data-bflvs-theme', 'dark');
            }
        },

        createBottomNav: function() {
            if (!CONFIG.bottom_nav || window.innerWidth > 768) return;

            const nav = document.createElement('div');
            nav.id = 'bflvs-bottom-nav';
            nav.innerHTML = `
                <button class="bflvs-nav-item" data-bflvs-action="Lessons">
                    <span>📚</span>
                    <div>Lessons</div>
                </button>
                <button class="bflvs-nav-item" data-bflvs-action="Assessments">
                    <span>📝</span>
                    <div>Assess</div>
                </button>
                <button class="bflvs-nav-item" data-bflvs-action="Gradebook">
                    <span>📊</span>
                    <div>Grades</div>
                </button>
                <button class="bflvs-nav-item" data-bflvs-action="Email">
                    <span>✉️</span>
                    <div>Email</div>
                </button>
            `;
            
            nav.addEventListener('click', (e) => {
                const btn = e.target.closest('.bflvs-nav-item');
                if (btn) {
                    const action = btn.getAttribute('data-bflvs-action');
                    this.triggerOriginalNav(action);
                }
            });

            document.body.appendChild(nav);
        },

        triggerOriginalNav: function(keyword) {
            console.log('Attempting to trigger:', keyword);
            const links = Array.from(document.querySelectorAll('a, button'));
            const target = links.find(el => {
                const text = el.innerText.toLowerCase();
                const href = el.href ? el.href.toLowerCase() : '';
                return text.includes(keyword.toLowerCase()) || href.includes(keyword.toLowerCase());
            });

            if (target) {
                console.log('Found target:', target);
                target.click();
            } else {
                console.log('No target found for:', keyword, '. Falling back to URL guessing.');
                // Fallback if the element isn't found (e.g. iframes or hidden deeper)
                const paths = {
                    'Lessons': '/vsa/educator/student/lessons',
                    'Assessments': '/vsa/educator/student/assessments',
                    'Gradebook': '/vsa/educator/student/gradebook',
                    'Email': '/vsa/educator/student/email'
                };
                if (paths[keyword]) window.location.href = paths[keyword];
            }
        },

        createFAB: function() {
            if (window.innerWidth > 768) return;

            const fab = document.createElement('div');
            fab.id = 'bflvs-fab';
            fab.innerHTML = '⚡';
            
            const menu = document.createElement('div');
            menu.className = 'bflvs-fab-menu';
            menu.innerHTML = `
                <button class="bflvs-fab-item" data-bflvs-action="Announcements" title="Announcements">📢</button>
                <button class="bflvs-fab-item" data-bflvs-action="Profile" title="Profile">👤</button>
                <div class="bflvs-fab-item" id="bflvs-toggle-dark" title="Toggle Dark Mode">🌓</div>
            `;

            fab.addEventListener('click', () => {
                menu.classList.toggle('active');
            });

            menu.addEventListener('click', (e) => {
                const btn = e.target.closest('[data-bflvs-action]');
                if (btn) {
                    const action = btn.getAttribute('data-bflvs-action');
                    this.triggerOriginalNav(action);
                }
            });

            document.body.appendChild(fab);
            document.body.appendChild(menu);

            document.getElementById('bflvs-toggle-dark').addEventListener('click', (e) => {
                e.stopPropagation();
                const isDark = document.documentElement.getAttribute('data-bflvs-theme') === 'dark';
                const newTheme = isDark ? 'light' : 'dark';
                document.documentElement.setAttribute('data-bflvs-theme', newTheme);
                GM_setValue('dark_mode', newTheme === 'dark');
            });
        },

        autoSave: function() {
            const inputs = document.querySelectorAll('textarea, input[type="text"]');
            inputs.forEach(input => {
                const key = `bflvs_draft_${window.location.pathname}_${input.name || input.id}`;
                
                // Load draft
                const saved = localStorage.getItem(key);
                if (saved && !input.value) {
                    const restoreBtn = document.createElement('button');
                    restoreBtn.innerText = 'Restore Draft';
                    restoreBtn.className = 'bflvs-restore-btn';
                    restoreBtn.onclick = (e) => {
                        e.preventDefault();
                        input.value = saved;
                        restoreBtn.remove();
                    };
                    input.parentNode.insertBefore(restoreBtn, input.nextSibling);
                }

                // Save draft
                input.addEventListener('input', () => {
                    localStorage.setItem(key, input.value);
                });
            });
        },

        contentCleanup: function() {
            if (!CONFIG.distraction_free) return;

            // Target assessment specific elements
            if (window.location.pathname.includes('assessments')) {
                const unnecessary = [
                    '.quiz-header', '.quiz-sidebar', '.header-bar', 
                    '#right-side', '.ic-app-nav-toggle-and-crumbs'
                ];
                unnecessary.forEach(sel => {
                    const el = document.querySelector(sel);
                    if (el) el.style.display = 'none';
                });
            }

            // Target teacher home pages (often have specific IDs or classes)
            if (document.body.classList.contains('teacher-page') || window.location.pathname.includes('teacher')) {
                document.querySelectorAll('.announcement-banner, .sidebar-nav').forEach(el => {
                    el.style.display = 'none';
                });
            }
        },

        readingOptimizer: function() {
            if (!window.location.pathname.includes('lessons')) return;

            const content = document.querySelector('#main-content') || document.querySelector('.lesson-content') || document.body;
            if (content) {
                content.classList.add('bflvs-reading-mode');
            }
        }
    };

    // Initialization logic
    document.addEventListener('DOMContentLoaded', function() {
        UI.injectStyles();
        UI.initTheme();
        UI.createBottomNav();
        UI.createFAB();
        UI.autoSave();
        UI.contentCleanup();
        UI.readingOptimizer();
        console.log('BetterFLVS initialized.');
    });



})();
