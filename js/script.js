AOS.init({duration:800,once:true,offset:80});

const typingText=document.getElementById("typing-text");
const roles=["Data Analyst","Data Cleaning Specialist","Data Visualization Enthusiast","AI & Automation Builder"];
let roleIndex=0,charIndex=0,isDeleting=false;
function typeEffect(){
  if(!typingText)return;
  const role=roles[roleIndex];
  typingText.textContent=role.substring(0,isDeleting?charIndex-1:charIndex+1);
  if(!isDeleting) charIndex++; else charIndex--;
  if(!isDeleting && charIndex===role.length){isDeleting=true;setTimeout(typeEffect,1500);return}
  if(isDeleting && charIndex===0){isDeleting=false;roleIndex=(roleIndex+1)%roles.length}
  setTimeout(typeEffect,isDeleting?45:85);
}
typeEffect();

const navbar=document.querySelector(".navbar");
window.addEventListener("scroll",()=>{
  navbar.style.background=window.scrollY>40?"rgba(5,8,22,.96)":"rgba(5,8,22,.72)";
});

const menuBtn=document.querySelector(".menu-btn");
const navMenu=document.querySelector(".nav-menu");
if(menuBtn) menuBtn.addEventListener("click",()=>{
  navMenu.classList.toggle("show");
  const icon=menuBtn.querySelector("i");
  icon.classList.toggle("fa-bars");
  icon.classList.toggle("fa-times");
});
document.querySelectorAll(".nav-menu a").forEach(link=>link.addEventListener("click",()=>{
  navMenu.classList.remove("show");
  const icon=menuBtn?.querySelector("i");
  if(icon){icon.classList.add("fa-bars");icon.classList.remove("fa-times")}
}));

const sections=document.querySelectorAll("main section[id]");
const navLinks=document.querySelectorAll(".nav-menu a");
window.addEventListener("scroll",()=>{
  let current="";
  sections.forEach(section=>{
    if(window.scrollY>=section.offsetTop-170) current=section.id;
  });
  navLinks.forEach(link=>link.classList.toggle("active",link.getAttribute("href")===`#${current}`));
});

document.getElementById("email-link").href=`mailto:${CONFIG.email}`;
document.getElementById("whatsapp-link").href=`https://wa.me/${CONFIG.whatsapp}`;
document.getElementById("linkedin-link").href=CONFIG.linkedin;
document.getElementById("github-link").href=CONFIG.github;
