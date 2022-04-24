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
const modalAddFrdBtn = document.querySelector("#modal-btn-add-friend");
const homePagination = document.querySelector("#home-pagination");
const searchForm = document.querySelector("#search-form");
const profilePerPage = 12;
let totalNumPage = 0;
let pageNum = 1;

//------ Functions ------

//Create pagination navigation bar
function createPagination(paginationSource) {
  totalNumPage = Math.ceil(paginationSource.length / profilePerPage);
  let paginationHTML = `<li class="page-item active"><a class="page-link" href="#" data-page="1">1</a></li>`;

  for (let i = 2; i <= totalNumPage; i++) {
    paginationHTML += `
  <li class="page-item"><a class="page-link" href="#" data-page=${i}>${i}</a></li>
  `;
  }

  homePagination.innerHTML = paginationHTML;
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
              <a href="#" id="btn-add-friend" class="btn btn-primary" data-id=${profile.id}>Add + </a>
            </div>
          </div>
        </div>
      </div>`;

    dataPanel.innerHTML = dataPanelHTML;
  });
}

// show profile details as modal on screen
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

      modalAddFrdBtn.dataset.id = response.data.id;
    })

    .catch(function (error) {
      console.log(error);
    });
}

//Store user to myFrdList @ localStorage
function addFriend(id) {
  const myFrdList = JSON.parse(localStorage.getItem("myFrdList")) || [];
  let frdToAdd = userProfile.find((profile) => profile.id === id);

  //prevent adding the same profile as friend twice
  if (myFrdList.some((profile) => profile.id === id)) {
    return alert("You two are friends already!");
  }

  //alert user if successfully add to friend list
  myFrdList.push(frdToAdd);
  alert("You two are friends now!");

  //update localStorage
  localStorage.setItem("myFrdList", JSON.stringify(myFrdList));
}

//------ Interactions ------
//get user data via axios, create pagination and update profile on the data panel
axios
  .get(USER_URL)
  .then(function (response) {
    userProfile.push(...response.data.results);
    createPagination(userProfile);
    createProfile(extractProfile(pageNum, userProfile));
  })
  .catch(function (error) {
    console.log(error);
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
  filteredProfile = userProfile.filter((profile) =>
    profile.name.toLowerCase().includes(keyword)
  );

  // alert if no result is found
  if (filteredProfile.length === 0) {
    searchInput.value = "";
    return alert("No match result");
  }

  //update pagination and show corresponding profiles on screen
  createPagination(filteredProfile);
  createProfile(extractProfile(pageNum, filteredProfile));

  //clear search input box
  searchInput.value = "";
});

// create Modal when click on "Details" button, or add profile to myFrdList when click on "Add +" button
dataPanel.addEventListener("click", function launchButtons(event) {
  if (event.target.matches("#btn-profile-details")) {
    showModal(parseInt(event.target.dataset.id));
  }
  if (event.target.matches("#btn-add-friend")) {
    addFriend(Number(event.target.dataset.id));
  }
});

//add to friend list if click on "add" button on modal
modalAddFrdBtn.addEventListener("click", function (event) {
  addFriend(Number(event.target.dataset.id));
});

//when modal is closed, clear the profile data for better UX, otherwise, modal will show profile details of previous users before changing to the new one clicked
modalPanel.addEventListener("hidden.bs.modal", function onModalClose(event) {
  modalTitle.innerHTML = "";
  modalAvatar.innerHTML = "";
  modalDescription.innerHTML = "";
});

//Update profiles, and enable profile change and pagination item color change when pagination items are clicked
homePagination.addEventListener("click", function updateDataPanel(event) {
  //ensure click happen to the page link only
  if (event.target.tagName === "A") {
    //extract the right list of profiles to be shown
    let pageNum = event.target.dataset.page;
    createProfile(extractProfile(pageNum, userProfile));

    //remove color from the previous pagination item
    const activePage = document.querySelector("li.active");
    activePage.classList.remove("active");

    //add color to the pagination item of the page currently shown
    event.target.parentElement.classList.add("active");
  }
});
