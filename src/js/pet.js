document.addEventListener("DOMContentLoaded", () => {
    const pet = document.getElementById("cute-pet");
    let holdTimeout;
    let isPetHidden = false;
  
    // Hover: Wiggle effect
    pet.addEventListener("mouseenter", () => {
      pet.style.animation = "wiggle 0.4s ease-in-out";
    });
  
    pet.addEventListener("mouseleave", () => {
      pet.style.animation = ""; // Reset animation
    });
  
    // Click: Small Jump effect
    pet.addEventListener("click", () => {
      pet.style.animation = "jump 0.4s ease-in-out";
      setTimeout(() => {
        pet.style.animation = ""; // Reset animation after jump
      }, 400);
    });
  
    // Hold: Disappear for 5 minutes
    pet.addEventListener("mousedown", () => {
      holdTimeout = setTimeout(() => {
        pet.style.display = "none"; // Hide pet
        isPetHidden = true;
  
        // Bring it back after 5 minutes
        setTimeout(() => {
          pet.style.display = "block";
          isPetHidden = false;
        }, 5 * 60 * 1000); // 5 minutes
  
      }, 1000); // Hold for 2 seconds
    });
  
    pet.addEventListener("mouseup", () => clearTimeout(holdTimeout));
    pet.addEventListener("mouseleave", () => clearTimeout(holdTimeout));
  });
  