const navButtons = document.querySelectorAll(".btn");
navButtons.forEach((button) => {
  if (localStorage.getItem(button.dataset.page) === "active") {
    button.classList.add("active");
  } else {
    button.classList.remove("active");
  }
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
