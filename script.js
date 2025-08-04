document.addEventListener('DOMContentLoaded', () => {
  const scrollContainer = document.querySelector('.all-sections');

  if (scrollContainer) {
    document.addEventListener('keydown', (event) => {
      // Get the height of the visible area of the scroll container
      const pageHeight = scrollContainer.clientHeight;

      switch (event.key) {
        case 'ArrowDown':
        case 'ArrowRight':
          // Scroll down by one page height
          scrollContainer.scrollBy({
            top: pageHeight,
            left: 0,
            behavior: 'smooth'
          });
          event.preventDefault(); // Prevent default browser scroll
          break;
        
        case 'ArrowUp':
        case 'ArrowLeft':
          // Scroll up by one page height
          scrollContainer.scrollBy({
            top: -pageHeight,
            left: 0,
            behavior: 'smooth'
          });
          event.preventDefault(); // Prevent default browser scroll
          break;
      }
    });
  }
});

const imageElement = document.getElementById("experiment-image");
const nextButton = document.getElementById("next-slide");

let currentIndex = 1;
const totalSlides = 5; // update based on how many images you have

nextButton.addEventListener("click", () => {
  currentIndex = currentIndex < totalSlides ? currentIndex + 1 : 1;
  imageElement.src = `content/comp_experiment/comp slide ${currentIndex}.png`;
});
