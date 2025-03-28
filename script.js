// Authentication state
function checkAuthState() {
    const token = localStorage.getItem('token');
    const authButtons = document.getElementById('authButtons');
    const userMenu = document.getElementById('userMenu');
    
    if (token) {
        authButtons.classList.add('hidden');
        userMenu.classList.remove('hidden');
        // Decode token to get user info (in a real app, you'd verify the token with the server)
        const payload = JSON.parse(atob(token.split('.')[1]));
        document.getElementById('userName').textContent = payload.user.name || 'User';
    } else {
        authButtons.classList.remove('hidden');
        userMenu.classList.add('hidden');
    }
}

// Logout functionality
document.getElementById('logoutButton')?.addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
});

// Check authentication state on page load
const mobileMenuButton = document.createElement('button');
mobileMenuButton.className = 'md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white';
mobileMenuButton.innerHTML = `
  <span class="sr-only">Open main menu</span>
  <i class="fas fa-bars"></i>
`;

const nav = document.querySelector('nav');
nav.insertBefore(mobileMenuButton, nav.firstChild);

const mobileMenu = document.createElement('div');
mobileMenu.className = 'hidden md:hidden bg-white shadow-lg';
mobileMenu.innerHTML = `
  <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
    <a href="#" class="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-gray-900 hover:bg-gray-50">Home</a>
    <a href="#" class="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50">Products</a>
    <a href="#" class="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50">Categories</a>
    <a href="#" class="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50">About</a>
  </div>
`;
nav.appendChild(mobileMenu);

mobileMenuButton.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
});

// Cart functionality
let cart = [];
const cartButton = document.querySelector('button[aria-label="Cart"]') || 
                   document.querySelector('button:has(i.fa-shopping-cart)');

function updateCartCount() {
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  if (cartButton) {
    cartButton.innerHTML = `<i class="fas fa-shopping-cart mr-2"></i>Cart (${count})`;
  }
}

// Add to cart buttons
document.addEventListener('click', (e) => {
  if (e.target && e.target.textContent === 'Add to cart') {
    const productCard = e.target.closest('.group');
    if (productCard) {
      const productName = productCard.querySelector('h3 a').textContent;
      const productPrice = parseFloat(productCard.querySelector('p.text-gray-900').textContent.replace('$', ''));
      
      const existingItem = cart.find(item => item.name === productName);
      if (existingItem) {
        existingItem.quantity++;
      } else {
        cart.push({
          name: productName,
          price: productPrice,
          quantity: 1
        });
      }
      
      updateCartCount();
      
      // Show added to cart notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg';
      notification.textContent = `${productName} added to cart!`;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.remove();
      }, 3000);
    }
  }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

// Form validation for contact form
const contactForm = document.querySelector('form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = contactForm.querySelector('input[type="email"]');
    const message = contactForm.querySelector('textarea');
    
    if (!email.value || !message.value) {
      alert('Please fill in all fields');
      return;
    }
    
    if (!email.value.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }
    
    // In a real app, you would send the form data to a server here
    alert('Thank you for your message! We will get back to you soon.');
    contactForm.reset();
  });
}

// Intersection Observer for scroll animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-fadeIn');
    }
  });
}, {
  threshold: 0.1
});

document.querySelectorAll('.feature, .product').forEach(el => {
  observer.observe(el);
});

// Initialize cart count
updateCartCount();