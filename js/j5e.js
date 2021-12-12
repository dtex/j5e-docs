let j5e = (function() {
  document.addEventListener('click', function (event) {

    // If the clicked element doesn't have the right selector, bail
    if (!event.target.matches('.menuToggle')) return;
  
    // Don't follow the link
    event.preventDefault();
  
    // Log the clicked element in the console
    ["menuOpen", "menuClose"].forEach(el => {
      document.getElementById(el).classList.toggle('opacity-0');
    });
    document.getElementById("leftnav").classList.toggle('hidden');
  
  }, false);
})();

module.exports = j5e;