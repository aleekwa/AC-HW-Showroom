//------ Interactions ------
//get my friend data from local storage, create pagination, and individual profiles
currentView = myFrdList;

if (myFrdList.length === 0) {
  alertNoFrd()
} else {
  createProfile(extractProfile(pageNum, currentView));
  createPagination (currentView)
}

