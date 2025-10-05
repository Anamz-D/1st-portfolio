const themeToggle = document.getElementById("themeToggle")
const themeText = document.getElementById("themeText")
const themeIcon = document.getElementById("themeIcon")
const html = document.documentElement

// Load saved theme from localStorage
const savedTheme = localStorage.getItem("theme") || "blue"
html.setAttribute("data-theme", savedTheme === "dark" ? "dark" : "blue")
updateThemeUI(savedTheme)

themeToggle.addEventListener("click", () => {
  const currentTheme = html.getAttribute("data-theme")
  const newTheme = currentTheme === "dark" ? "blue" : "dark"

  html.setAttribute("data-theme", newTheme)
  localStorage.setItem("theme", newTheme)
  updateThemeUI(newTheme)
})

function updateThemeUI(theme) {
  if (theme === "dark") {
    themeText.textContent = "Dark"
    themeIcon.innerHTML = `
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    `
  } else {
    themeText.textContent = "Blue"
    themeIcon.innerHTML = `
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    `
  }
} //everything above is new

// Mobile Navigation Toggle
const navToggle = document.getElementById("navToggle")
const navMenu = document.getElementById("navMenu")
const navLinks = document.querySelectorAll(".nav-link")

navToggle.addEventListener("click", () => {
  navToggle.classList.toggle("active")
  navMenu.classList.toggle("active")
})

// Close mobile menu when clicking on a link
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navToggle.classList.remove("active")
    navMenu.classList.remove("active")
  })
})

// Navbar scroll effect
const navbar = document.getElementById("navbar")
let lastScroll = 0

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset

  if (currentScroll > 100) {
    navbar.classList.add("scrolled")
  } else {
    navbar.classList.remove("scrolled")
  }

  lastScroll = currentScroll
})

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))

    if (target) {
    //   const offsetTop = target.offsetTop - 80      
       const navHeight = navbar.offsetHeight
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset
      const offsetPosition = targetPosition - navHeight - 20

      window.scrollTo({
        // top: offsetTop,
        top: offsetPosition,
        behavior: "smooth",
      })
    }
  })
})

// Intersection Observer for fade-in animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -100px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("fade-in")
      observer.unobserve(entry.target)
    }
  })
}, observerOptions)

// Observe all sections and cards
document.querySelectorAll(".section, .card").forEach((el) => {
  observer.observe(el)
})

// Update copyright year
document.getElementById("year").textContent = new Date().getFullYear()

// Active navigation link based on scroll position
const sections = document.querySelectorAll("section[id]")

function highlightNavigation() {
  const scrollY = window.pageYOffset

  sections.forEach((section) => {
    const sectionHeight = section.offsetHeight
    const sectionTop = section.offsetTop - 100
    const sectionId = section.getAttribute("id")
    const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`)

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      navLinks.forEach((link) => link.classList.remove("active"))
      if (navLink) {
        navLink.classList.add("active")
      }
    }
  })
}

window.addEventListener("scroll", highlightNavigation)

// Parallax effect for hero section
const hero = document.querySelector(".hero")

// window.addEventListener("scroll", () => {
//   const scrolled = window.pageYOffset
//   if (hero) {
//     hero.style.transform = `translateY(${scrolled * 0.5}px)`
//   }
// })

// Add hover effect to cards
const cards = document.querySelectorAll(".card")

cards.forEach((card) => {
  card.addEventListener("mouseenter", function () {
    this.style.transform = "translateY(-8px) scale(1.02)"
  })

  card.addEventListener("mouseleave", function () {
    this.style.transform = "translateY(0) scale(1)"
  })
})

// Typing effect for hero subtitle (optional enhancement)
const heroSubtitle = document.querySelector(".hero-subtitle")
if (heroSubtitle) {
  const text = heroSubtitle.textContent
  heroSubtitle.textContent = ""
  let i = 0

  function typeWriter() {
    if (i < text.length) {
      heroSubtitle.textContent += text.charAt(i)
      i++
      setTimeout(typeWriter, 100)
    }
  }

  // Start typing effect after page load
  window.addEventListener("load", () => {
    setTimeout(typeWriter, 500)
  })
}
// Contact Form Handling with Web3Forms
const contactForm = document.getElementById("contactForm")
const submitBtn = document.getElementById("submitBtn")
const btnText = document.getElementById("btnText")
const formMessage = document.getElementById("formMessage")

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault()

  // Disable button and show loading state
  submitBtn.disabled = true
  btnText.innerHTML = '<span class="spinner"></span>'
  formMessage.style.display = "none"

  // Get form data
  const formData = new FormData(contactForm)

  // Web3Forms API endpoint
  const accessKey = "YOUR_WEB3FORMS_ACCESS_KEY" // Replace with your actual key

  // Add access key to form data
  formData.append("access_key", accessKey)

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    })

    const data = await response.json()

    if (data.success) {
      // Success
      formMessage.textContent = "Message sent successfully! I'll get back to you soon."
      formMessage.className = "form-message success"
      contactForm.reset()
    } else {
      // Error from API
      formMessage.textContent = "Oops! Something went wrong. Please try again."
      formMessage.className = "form-message error"
    }
  } catch (error) {
    // Network error
    formMessage.textContent = "Network error. Please check your connection and try again."
    formMessage.className = "form-message error"
  } finally {
    // Re-enable button
    submitBtn.disabled = false
    btnText.textContent = "Send Message"
  }
})

// Console message for developers
// console.log("%cHey there! 👋", "color: #00d9ff; font-size: 20px; font-weight: bold;")
// console.log("%cLooking at the code? Feel free to reach out!", "color: #8892b0; font-size: 14px;")
// console.log("%canammahdavid@gmail.com", "color: #00b8a9; font-size: 14px;")
console.log("%cHey there! 👋", "color: #3b82f6; font-size: 20px; font-weight: bold;")
console.log("%cLooking at the code? Feel free to reach out!", "color: #94a3b8; font-size: 14px;")
console.log("%canammahdavid@gmail.com", "color: #60a5fa; font-size: 14px;")