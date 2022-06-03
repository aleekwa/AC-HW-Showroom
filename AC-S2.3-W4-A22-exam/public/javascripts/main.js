const navButtons = document.querySelectorAll(".btn");
navButtons.forEach((button) => {
  if (localStorage.getItem(button.dataset.page) === "active") {
    button.classList.add("active");
  } else {
    button.classList.remove("active");
  }
  console.log(button.classList);
});

const navigation = document.querySelector("nav");

navigation.addEventListener("click", function (event) {
  if (event.target.tagName !== "A") return;

  if (event.target.dataset.page !== "homepage") {
    localStorage.clear();
    localStorage.setItem(event.target.dataset.page, "active");
  } else {
    localStorage.clear();
  }
});

console.log(localStorage.getItem("homepage"));
console.log(localStorage.getItem("about"));
console.log(localStorage.getItem("portfolio"));
console.log(localStorage.getItem("contact"));
