/* Theme toggle button in the header */
(function(){
  var btn=document.getElementById('theme-toggle');
  if(!btn)return;
  btn.addEventListener('click',function(){
    var root=document.documentElement;
    var isDark=root.getAttribute('data-theme')==='dark'||
      (!root.getAttribute('data-theme')&&window.matchMedia('(prefers-color-scheme: dark)').matches);
    var next=isDark?'light':'dark';
    root.setAttribute('data-theme',next);
    localStorage.setItem('theme',next);
  });
})();
