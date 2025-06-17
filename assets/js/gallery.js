let galleryItems = [];
let galleryLightbox;

fetch("service/gallery/" + getURLParameter("id") +  ".json")
  .then(response => response.json())
  .then(data => {
    galleryItems = data.map(item => ({
      href: item.href,
      type: 'image',
      title: item.title
    }));

    // Initialisiere die Lightbox einmal
    galleryLightbox = GLightbox({
      elements: galleryItems,
      touchNavigation: true,
      loop: true
    });
  });

document.getElementById("gallery-btn").addEventListener("click", function (e) {
  e.preventDefault();
  if (galleryLightbox) {
    galleryLightbox.open(); // Öffnen ist jetzt synchron!
  }
});

// Bilder aus Konfigurationsdatei laden
document.getElementById("gallery-btn").addEventListener("click", function (e) {
  e.preventDefault();
  if (galleryLightbox) {
    galleryLightbox.open(); // Öffnen ist jetzt synchron!
  }
});