//------ Interactions ------
//get user data via axios, create pagination and update profile on the data panel
currentView = userProfile;

axios
  .get(USER_URL)
  .then(function (response) {
    userProfile.push(...response.data.results);
    createPagination(currentView);
    createProfile(extractProfile(pageNum, currentView));
  })
  .catch(function (error) {
    console.log(error);
  });
