const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/2310-FSA-ET-WEB-PT/events`;

const state = {
  events: [],
};

//Select Event UL
const eventList = document.querySelector("#events");

//Select Add Event Form
const addEventForm = document.querySelector("#addEvent");

//Call up add event form. Reference asyn event.
addEventForm.addEventListener("submit", addEvent);

/**
 * Sync state with the API and rerender
 */

//Call Get Events and Render them Out
async function render() {
  await getEvents();
  renderEvents();
}
render();

/**
 * Update state with artists from API
 */

//Get events function
async function getEvents() {
  try {

    //Fetch API URL
    const response = await fetch(API_URL);

    //Get Json
    const json = await response.json();

    //Assign JSOn data to array
    state.events = json.data;
  }
  catch (err) {
    console.log(err);
  }
}


/**
 * Render artists from state
 */
function renderEvents() {

  //If nothing is in array say there's no events
  if (!state.events.length) {
    eventList.innerHTML = "<li>No Events</li>";
    return;
  }

  //Use map to map out events onto li
  const eventCards = state.events.map((event) => {
    const li = document.createElement("li");
    li.innerHTML = `
    <h2>${event.name}</h2>
    <p>${event.date}</p>
    <p>${event.location}</p>
    <p>${event.description}</p>
    `;
  

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete Event";
  deleteButton.setAttribute("data-event-id", event.id);

  deleteButton.addEventListener("click", (e) => {
    e.preventDefault();
    deleteEvent(event.id);
  });

  li.appendChild(deleteButton);
 

  return li;
});

eventList.replaceChildren(...eventCards);
}

async function addEvent(event) {
  event.preventDefault();

  try {
    const dateInput = document.getElementById("date-input").value;
    let isoDate;

    try {
     const date = new Date(dateInput);
     if(isNaN(date.getTime())) {
      throw new Error("Invalid date");
     }
     isoDate = date.toISOString();
    } catch (error) {
      console.error("Data parsing error:", error);
      return;
    }

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: addEventForm.name.value,
        description: addEventForm.description.value,
        date: isoDate,
        location: addEventForm.location.value,
      }),
    });
    if (!response.ok) {
      throw new Error("Failed to create event")
    }

    render();
  } catch (error) {
    console.error(error);
  }
}

async function deleteEvent(id) {
  try {
      const response = await fetch(`${API_URL}/${id}`, {
          method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete event: ${response.status}`);
    }
    render(); // Re-render the event list to reflect the deletion   
  }
  
  catch (err) {
      console.log(err);
  }
}

// async function addEvent(event) {
//   event.preventDefault();

//   try {
//     //Assign fetch API to response
//     //Method is post
//     //Make headers JSON
//     //send the data to JSON

//     const response = await fetch(API_URL, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         name: addEventForm.name.value,
//         description: addEventForm.description.value,
//         date: addEventForm.date.value,
//         location: addEventForm.location.value,
//       }),
//     });
  
//     if (!response.ok) {
//       throw new Error("Failed to create event")
//     }

//     render();
//   } catch (error) {
//     console.error(error);
//   }
// }