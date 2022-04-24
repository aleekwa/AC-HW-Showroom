//------ Variables ------
const BASE_URL = `https://lighthouse-user-api.herokuapp.com`;
const USER_URL = `${BASE_URL}/api/v1/users/`;
const myFrdList = JSON.parse(localStorage.getItem("myFrdList")) || [];

const dataPanel = document.querySelector("#data-panel");
const btnDetails = document.querySelector("#btn-profile-details");
const modalPanel = document.querySelector("#profile-details-modal");
const modalTitle = document.querySelector("#profile-modal-title");
const modalAvatar = document.querySelector("#profile-modal-avatar");
const modalDescription = document.querySelector("#profile-modal-description");
const modalAddFrdBtn = document.querySelector("#modal-btn-add-friend");
const paginator = document.querySelector("#paginator");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const myFrdListHTML = document.querySelector("#my-friend-page");

const profilePerPage = 12;
let totalNumPage = 0;
let pageNum = 1;
let currentView = []; //to enable search function across html, points to userProfile on "index" page or myFrdList on "MyFriendList" page
const userProfile = []; //store full user profile list extracted via axios on index page
let filteredProfile = []; //store search results
let extractedUserProfile = []; //store list of profiles to be shown on screen, limted by profilePerPage setting

//------ Functions ------
//Create pagination navigation bar
function createPagination(paginationSource) {
  totalNumPage = Math.ceil(paginationSource.length / profilePerPage);
  let paginationHTML = ``;

  for (let i = 1; i <= totalNumPage; i++) {
    paginationHTML += `
  <li class="page-item"><a class="page-link" href="#" data-page=${i}>${i}</a></li>
  `;
  }
  paginator.innerHTML = paginationHTML;

  paginator.firstElementChild.classList.add("active");
}

// create an array of user profile for corresponding pages
function extractProfile(page, paginationSource) {
  const startingIndex = (page - 1) * profilePerPage;
  const endingIndex = startingIndex + profilePerPage;
  return paginationSource.slice(startingIndex, endingIndex);
}

// create individual profile card on the page
function createProfile(users) {
  let dataPanelHTML = "";

  users.forEach(({ avatar, name, surname, id }) => {
    dataPanelHTML += `
      <div class="col-sm-2">
        <div class="mb-2">
          <div class="card">
            <img src="${avatar}" class="profile-card-avatar" alt="avatar" />
            <div class="card-body text-secondary">
              <h6 class="profile-card-name">${name} ${surname}</h6>
              <a href="#" id="btn-profile-details" class="btn btn-info"
                data-bs-toggle="modal" data-bs-target="#profile-details-modal" data-id=${id}>Details</a
                  >`;

    if (myFrdList.some((profile) => profile.id === id)) {
      dataPanelHTML += `
              <i class="fa-regular fa-solid fa-heart" id="btn-heart" data-id=${id}> </i>`;
    } else {
      dataPanelHTML += `
              <i class="fa-regular fa-heart" id="btn-heart" data-id=${id}> </i>`;
    }

    dataPanelHTML += `
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

//enable heart button
function searchProfile(id) {
  //If the profile is on the friend list already, it means the user wants to unfriend this profile
  if (myFrdList.some((profile) => profile.id === id)) {
    deleteFriend(id);
  } else {
    addFriend(id);
  }
}
//Store user to myFrdList @ localStorage
function addFriend(id) {
  let frdToAdd = currentView.find((profile) => profile.id === id);

  myFrdList.push(frdToAdd);
  alert("You two are friends now!");
  //update localStorage
  localStorage.setItem("myFrdList", JSON.stringify(myFrdList));
}

//remove friend from localStorage when clicked on "delete" and update the data panel on screen
function deleteFriend(id) {
  //locate the index position of the friend on the myFrdList and remove it
  let frdToDeleteIndex = myFrdList.findIndex((profile) => profile.id === id);
  myFrdList.splice(frdToDeleteIndex, 1);
  localStorage.setItem("myFrdList", JSON.stringify(myFrdList));

  //Move on to repopulate the data panel if we are on the MyFriendList.html; stop if we are on index.html
  if (myFrdListHTML.classList.contains("active")) {
    //When there is no friend on the list
    if (myFrdList.length === 0) {
      return alertNoFrd();
    }

    //If there is no more item to show on current page, jump to the previous page
    if (Math.ceil(myFrdList.length / profilePerPage) < pageNum) {
      pageNum -= 1;
    }

    //Remove unnecessary pagination item by creating new pagination bar
    if (Math.ceil(myFrdList.length / profilePerPage) !== totalNumPage) {
      createPagination(currentView);

      //By default, when new pagination bar is created, page 1 is color, so if the current page on screen is larger than 1, need to update the color of pagination item
      if (pageNum > 1) {
        let activePage = document.querySelector(".page-item.active");
        activePage.parentElement.children[pageNum - 1].classList.add("active");
        activePage.classList.remove("active");
      }
    }

    //Populate data panel with corresponding profiles
    createProfile(extractProfile(pageNum, currentView));
  }
}

function alertNoFrd() {
  dataPanel.innerHTML = `<h5> You have no friend yet </h5>`;
  paginator.innerHTML = "";
}

//----- Interactions ------

// create Modal when click on "Details" button, or add/remove profile to/from myFrdList when click on "heart" button
dataPanel.addEventListener("click", function launchButtons(event) {
  if (event.target.matches("#btn-profile-details")) {
    showModal(parseInt(event.target.dataset.id));
  }
  if (event.target.matches("#btn-heart")) {
    event.target.classList.toggle("fa-solid");
    searchProfile(Number(event.target.dataset.id));
  }
});

//when modal is closed, clear the profile data for better UX, otherwise, modal will show profile details of previous users before changing to the new one clicked
modalPanel.addEventListener("hidden.bs.modal", function onModalClose(event) {
  modalTitle.innerHTML = "";
  modalAvatar.innerHTML = "";
  modalDescription.innerHTML = "";
});

//Search function

searchForm.addEventListener("input", function onSearchFormSubmitted(event) {
  //event.preventDefault();
  const keyword = searchInput.value.trim().toLowerCase();

  // if search input is not empty, compare the names of the user profiles with the search value and store matching profiles in filteredProfile array
  if (!keyword.length !== 0) {
    filteredProfile = currentView.filter((profile) =>
      profile.name.toLowerCase().includes(keyword)
    );

    // if no matching resulting, alert user and remove paginator
    if (filteredProfile.length === 0) {
      dataPanel.innerHTML = `<h5> No match result </h5>`;
      paginator.innerHTML = "";
    } else {
      //update pagination and show corresponding profiles on screen
      pageNum = 1;
      createPagination(filteredProfile);
      createProfile(extractProfile(pageNum, filteredProfile));
    }
  } else {
    //if search input is empty, show full user/friend list
    pageNum = 1;
    createPagination(currentView);
    createProfile(extractProfile(pageNum, currentView));
  }
});

//Update profiles, and enable profile change and pagination item color change when pagination items are clicked
paginator.addEventListener("click", function updateDataPanel(event) {
  //ensure click happen to the page link only
  if (event.target.tagName === "A") {
    //extract the right list of profiles to be shown
    pageNum = event.target.dataset.page;
    let profileSource = filteredProfile.length ? filteredProfile : currentView;
    createProfile(extractProfile(pageNum, profileSource));

    //remove color from the previous pagination item
    const activePage = document.querySelector(".page-item.active");
    activePage.classList.remove("active");

    //add color to the pagination item of the page currently shown
    event.target.parentElement.classList.add("active");
  }
});
