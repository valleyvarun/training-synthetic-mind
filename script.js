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


