//------ Variables ------
const BASE_URL = `https://lighthouse-user-api.herokuapp.com`;
const USER_URL = `${BASE_URL}/api/v1/users/`;
const userProfile = [];
let extractedUserProfile = [];
const dataPanel = document.querySelector("#data-panel");
const btnDetails = document.querySelector("#btn-profile-details");
const modalPanel = document.querySelector("#profile-details-modal");
const modalTitle = document.querySelector("#profile-modal-title");
const modalAvatar = document.querySelector("#profile-modal-avatar");
const modalDescription = document.querySelector("#profile-modal-description");
const frdListPagination = document.querySelector("#frd-list-pagination");
const searchForm = document.querySelector("#search-form");
const profilePerPage = 12;
let totalNumPage = 0;
let pageNum = 1;

//------ Functions ------

// Create pagination navigation bar
function createPagination(paginationSource) {
  totalNumPage = Math.ceil(paginationSource.length / profilePerPage);
  let paginationHTML = `<li class="page-item active"><a class="page-link" href="#" data-page="1">1</a></li>`;

  for (let i = 2; i <= totalNumPage; i++) {
    paginationHTML += `
  <li class="page-item"><a class="page-link" href="#" data-page=${i}>${i}</a></li>
  `;
  }
  frdListPagination.innerHTML = paginationHTML;
}

// create an array of user profile for corresponding pages
function extractProfile(page, paginationSource) {
  if (page < 0) {
    page = 1;
  }

  const startingIndex = (page - 1) * profilePerPage;
  const endingIndex = startingIndex + profilePerPage;
  return paginationSource.slice(startingIndex, endingIndex);
}

// create individual profile card on the page
function createProfile(users) {
  let dataPanelHTML = "";

  users.forEach((profile) => {
    dataPanelHTML += `
      <div class="col-sm-2">
        <div class="mb-2">
          <div class="card">
            <img src="${profile.avatar}" class="profile-card-avatar" alt="avatar" />
            <div class="card-body text-secondary">
              <h6 class="profile-card-name">${profile.name} ${profile.surname}</h6>
              <a href="#" id="btn-profile-details" class="btn btn-info"
                data-bs-toggle="modal" data-bs-target="#profile-details-modal" data-id=${profile.id}>Details</a
                  >
              <a href="#" id="btn-delete-friend" class="btn btn-danger" data-id=${profile.id}> Remove </a>
            </div>
          </div>
        </div>
      </div>`;

    dataPanel.innerHTML = dataPanelHTML;
  });
}

//Create modal
function showModal(id) {
  axios
    .get(`${USER_URL}${id}`)
    .then(function (response) {
      modalTitle.innerText = `${response.data.name} ${response.data.surname} `;

      if (response.data.gender === "female") {
        modalTitle.innerHTML += `<i class="fa-solid fa-venus"></i>`;
      } else {
        modalTitle.innerHTML += `<i class="fa-solid fa-mars"></i>`;
      }

      modalAvatar.innerHTML = `
    <img src="${response.data.avatar}" alt="avatar" class="image-fluid">`;

      modalDescription.innerHTML = `
        <p> <i class="fa-solid fa-location-dot"></i> : ${response.data.region} </p>
        <p> <i class="fa-solid fa-cake-candles"></i> : ${response.data.birthday} (${response.data.age} y.o.) </p>
        <p> <i class="fa-solid fa-at"></i> : ${response.data.email} </p>`;
    })
    .catch(function (error) {
      console.log(error);
    });
}

//remove friend from localStorage when clicked on "delete" and update the data panel on screen
function deleteFriend(id) {
  //locate the index position of the friend on the myFrdList and remove it
  let frdToDeleteIndex = myFrdList.findIndex((profile) => profile.id === id);
  myFrdList.splice(frdToDeleteIndex, 1);
  localStorage.setItem("myFrdList", JSON.stringify(myFrdList));

  //if there is no more friend on the list, clear data panel and alert user
  if (myFrdList.length === 0) {
    dataPanelHTML = `<p> You don't have any friends yet </p>`;
    dataPanel.innerHTML = dataPanelHTML;
    return alert("Go find some new friends!");
  }

  //If there is no more item to show on current page, jump to the previous page
  if (Math.ceil(myFrdList.length / profilePerPage) < pageNum) {
    pageNum -= 1;
  }

  //Remove unnecessary pagination item by creating new pagination bar
  if (Math.ceil(myFrdList.length / profilePerPage) !== totalNumPage) {
    createPagination(myFrdList);

    //By default, when new pagination bar is created, page 1 is color, so if the current page on screen is larger than 1, need to update the color of pagination item
    if (pageNum > 1) {
      let activePage = document.querySelector("li.active");
      activePage.parentElement.children[pageNum - 1].classList.add("active");
      activePage.classList.remove("active");
    }
  }

  //Populate data panel with corresponding profiles
  createProfile(extractProfile(pageNum, myFrdList));
}

//------ Interactions ------
//get my friend data from local storage, create pagination, and individual profiles
const myFrdList = JSON.parse(localStorage.getItem("myFrdList"));
createPagination(myFrdList);

//if there is no more friend on the list, clear data panel and alert user
if (myFrdList.length === 0) {
  dataPanelHTML = `<p> You don't have any friends yet </p>`;
  dataPanel.innerHTML = dataPanelHTML;
} else {
  createProfile(extractProfile(pageNum, myFrdList));
}
// create Modal when click on "Details" button, remove friend from the list when click on "Remove" button
dataPanel.addEventListener("click", function launchButtons(event) {
  if (event.target.matches("#btn-profile-details")) {
    showModal(parseInt(event.target.dataset.id));
  }

  if (event.target.matches("#btn-delete-friend")) {
    deleteFriend(Number(event.target.dataset.id));
  }
});

//when modal is closed, clear the profile data for better UX, otherwise, modal will show profile details of previous users before changing to the new one clicked
modalPanel.addEventListener("hidden.bs.modal", function onModalClose(event) {
  modalTitle.innerHTML = "";
  modalAvatar.innerHTML = "";
  modalDescription.innerHTML = "";
});

//Update profiles on the page and pagination item color  when pagination items are clicked
frdListPagination.addEventListener("click", function updateDataPanel(event) {
  //ensure click happen to the page link only
  if (event.target.tagName === "A") {
    //extract the right list of profiles to be shown
    pageNum = event.target.dataset.page;
    createProfile(extractProfile(pageNum, myFrdList));

    //remove color from the previous pagination item
    let activePage = document.querySelector("li.active");
    activePage.classList.remove("active");

    //add color to the pagination item of the page currently shown
    event.target.parentElement.classList.add("active");
  }
});

//Search function
const searchInput = document.querySelector("#search-input");

searchForm.addEventListener("submit", function onSearchFormSubmitted(event) {
  event.preventDefault();
  const keyword = searchInput.value.trim().toLowerCase();
  let filteredProfile = [];

  //prevent empty input
  if (!keyword.length) {
    return alert("請輸入有效字串！");
  }

  //compare the names of the user profiles with the search value and store matching profiles in filteredProfile array
  filteredProfile = myFrdList.filter((profile) =>
    profile.name.toLowerCase().includes(keyword)
  );

  // alert if no result is found
  if (filteredProfile.length === 0) {
    searchInput.value = "";
    alert("No match result");
  }

  //update pagination and show corresponding profiles on screen
  createPagination(filteredProfile);
  createProfile(extractProfile(pageNum, filteredProfile));

  //clear search input box
  searchInput.value = "";
});
