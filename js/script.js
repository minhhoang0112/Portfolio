// Đa ngôn ngữ cho typing subtitle
const typingTextElement = document.getElementById("typing-text");
const nameElement = document.getElementById("typing-name");
const langSelect = document.getElementById("langSelect");

// Đa ngôn ngữ cho tên
const nameTexts = {
  vi: "HOÀNG CÔNG MINH",
  en: "HOANG CONG MINH",
  zh: "黄公明",
  th: "HOÀNG CÔNG MINH",
};
// Đa ngôn ngữ cho typing hiệu ứng subtitle
const typingPhrases = {
  vi: [
    "Sinh viên Công nghệ Thông tin - UTH",
    "Đam mê phát triển Web Front-end",
    "Luôn tìm kiếm cơ hội học hỏi và sáng tạo",
  ],
  en: [
    "IT Student - UTH",
    "Passionate Front-end Web Developer",
    "Always learning and seeking creativity",
  ],
  zh: ["信息技术学生 - UTH", "热爱前端网页开发", "不断学习，勇于创新"],
  th: [
    "นักศึกษา IT - UTH",
    "ชื่นชอบการพัฒนาเว็บ Front-end",
    "เรียนรู้และสร้างสรรค์อยู่เสมอ",
  ],
};

// Hiệu ứng gõ tên
let nameIndex = 0;
let currentLang = langSelect.value;
function typeName(text) {
  nameElement.textContent = "";
  nameIndex = 0;
  function loop() {
    if (nameIndex < text.length) {
      nameElement.textContent += text.charAt(nameIndex);
      nameIndex++;
      setTimeout(loop, 110);
    }
  }
  loop();
}

// Hiệu ứng typing subtitle
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingTimeout;

function typeWriter(phrases) {
  const currentPhrase = phrases[phraseIndex];
  if (isDeleting) {
    typingTextElement.textContent = currentPhrase.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typingTextElement.textContent = currentPhrase.substring(0, charIndex + 1);
    charIndex++;
  }

  let currentSpeed = isDeleting ? 55 : 100;
  const pauseBeforeTyping = 1000;
  const pauseBeforeDeleting = 1700;

  if (!isDeleting && charIndex === currentPhrase.length) {
    currentSpeed = pauseBeforeDeleting;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    currentSpeed = pauseBeforeTyping;
  }

  typingTimeout = setTimeout(() => typeWriter(phrases), currentSpeed);
}

// Đổi ngôn ngữ
function changeLanguage(lang) {
  currentLang = lang;

  // Đổi text tên
  typeName(nameTexts[lang]);
  // Đổi hiệu ứng typing subtitle
  clearTimeout(typingTimeout);
  phraseIndex = 0;
  charIndex = 0;
  isDeleting = false;
  setTimeout(() => typeWriter(typingPhrases[lang]), 500);

  // Đổi toàn bộ phần .lang-vi .lang-en .lang-zh .lang-th
  ["vi", "en", "zh", "th"].forEach((l) => {
    document.querySelectorAll(".lang-" + l).forEach((el) => {
      el.style.display = l === lang ? "" : "none";
    });
  });

  // Đổi placeholder và button trong form
  document.getElementById("nameInput").placeholder = document
    .getElementById("nameInput")
    .getAttribute("data-placeholder-" + lang);
  document.getElementById("emailInput").placeholder = document
    .getElementById("emailInput")
    .getAttribute("data-placeholder-" + lang);
  document.getElementById("subjectInput").placeholder = document
    .getElementById("subjectInput")
    .getAttribute("data-placeholder-" + lang);
  document.getElementById("messageInput").placeholder = document
    .getElementById("messageInput")
    .getAttribute("data-placeholder-" + lang);
  document.getElementById("formBtn").textContent = document
    .getElementById("formBtn")
    .getAttribute("data-label-" + lang);
}

// Lưu lại hiệu ứng typing ban đầu khi load trang
document.addEventListener("DOMContentLoaded", () => {
  // Gõ tên
  typeName(nameTexts[currentLang]);
  // Đợi xong tên, gõ subtitle
  setTimeout(
    () => typeWriter(typingPhrases[currentLang]),
    nameTexts[currentLang].length * 110 + 400
  );

  // Kích hoạt fade-in hiệu ứng trang chủ
  document.querySelectorAll(".home-section .fade-in-up").forEach((el) => {
    el.classList.add("active");
  });
});

// Xử lý chọn ngôn ngữ
langSelect.addEventListener("change", function () {
  changeLanguage(this.value);
  // Cập nhật lang cho html tag
  document.documentElement.lang = this.value;
});

// Smooth scroll cho navbar
document.querySelectorAll(".navbar a").forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(".navbar").classList.remove("active");
    document.getElementById("menu-icon").classList.remove("open");
    document
      .querySelectorAll(".navbar a")
      .forEach((link) => link.classList.remove("active"));
    this.classList.add("active");
    const targetId = this.getAttribute("href").substring(1);
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      window.scrollTo({
        top: targetSection.offsetTop - 80,
        behavior: "smooth",
      });
    }
  });
});

// Mobile menu toggle
const menuIcon = document.getElementById("menu-icon");
const navbar = document.querySelector(".navbar");
menuIcon.addEventListener("click", () => {
  navbar.classList.toggle("active");
  menuIcon.classList.toggle("open");
});

// Intersection Observer for fade-in và skill bar
const observerOptions = { root: null, rootMargin: "0px", threshold: 0.2 };
const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      if (entry.target.classList.contains("fade-in-up")) {
        entry.target.classList.add("active");
        observer.unobserve(entry.target);
      }
      if (entry.target.classList.contains("fade-in-left")) {
        entry.target.classList.add("active");
        observer.unobserve(entry.target);
      }
      if (entry.target.classList.contains("skills-section")) {
        triggerSkillBars();
      }
    }
  });
}, observerOptions);

document.querySelectorAll(".fade-in-up").forEach((el) => observer.observe(el));
document
  .querySelectorAll(".fade-in-left")
  .forEach((el) => observer.observe(el));
observer.observe(document.getElementById("skills"));

// Animate skill bars
function triggerSkillBars() {
  document.querySelectorAll(".skill-progress-fill").forEach((bar) => {
    const percent = bar.dataset.percent;
    bar.style.width = "0%";
    setTimeout(() => {
      bar.style.width = percent + "%";
    }, 100);
  });
}

// Scroll to top button
const fab = document.querySelector(".fab");
window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    fab.classList.add("show");
  } else {
    fab.classList.remove("show");
  }
  // Update active link
  const sections = document.querySelectorAll("section");
  let currentActive = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.clientHeight;
    if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
      currentActive = section.getAttribute("id");
    }
  });
  document.querySelectorAll(".navbar a").forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href").substring(1) === currentActive) {
      link.classList.add("active");
    }
  });
});

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Contact form submit
document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const lang = langSelect.value;
  const messages = {
    vi: "Đã gửi liên hệ thành công! Cảm ơn bạn.",
    en: "Message sent successfully! Thank you.",
    zh: "消息已成功发送！感谢您的联系。",
    th: "ส่งข้อความเรียบร้อยแล้ว! ขอบคุณครับ",
  };
  const formMessage = document.getElementById("formMessage");
  formMessage.textContent = messages[lang];
  formMessage.style.color = getComputedStyle(
    document.documentElement
  ).getPropertyValue("--color-accent");
  this.reset();
  setTimeout(() => {
    formMessage.textContent = "";
  }, 4000);
});
