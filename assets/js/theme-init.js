/* Apply saved theme before first paint to prevent flash — loaded blocking in <head> */
(function(){var t=localStorage.getItem('theme');if(t)document.documentElement.setAttribute('data-theme',t);})();
