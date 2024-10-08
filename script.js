let toggleBurger = document.getElementsByClassName('burger')[0];
let toggleNavlinks = document.getElementsByClassName('navlinks')[0];
toggleBurger.addEventListener('click', function()
{
    toggleNavlinks.classList.toggle('active')
})
