import Shepherd from './shepherd.mjs';

const helpButton = document.getElementById('help-button');

const tour = new Shepherd.Tour({
	defaults: {
		classes: "shepherd-element",
		scrollTo: { behavior: "smooth", block: "center" },
		// Add more default options as needed
	},
});

tour.addStep({
	id: "welcome",
	title: "Welcome to History Viewer",
	text: "This extension lets you view and manage your browsing history.",
	attachTo: {
		element: "#page-heading",
		on: "bottom",
	},
	buttons: [
		{
			text: "Next",
			action: tour.next,
		},
	],
});

tour.addStep({
	id: "search",
	title: "Search Your History",
	text: "Use the search bar to quickly find specific websites or pages.",
	attachTo: {
		element: "#search-input",
		on: "bottom",
	},
	buttons: [
		{
			text: "Back",
			action: tour.back,
		},
		{
			text: "Next",
			action: tour.next,
		},
		
	],
});

tour.addStep({
	id: "favorites",
	title: "Favorites",
	text: 'Mark your favorite websites by selecting them and clicking the "Favorite" button in the popup.',
	attachTo: { element: 'input[type="checkbox"]:first-of-type', on: 'right' },
	buttons: [
		{
			text: "Back",
			action: tour.back,
		},
		{
			text: "Next",
			action: tour.next,
		},
	],
});

tour.addStep({
	id: "favorites-list",
	title: "View Your Favorites",
	text: 'Click the "Favorites" button to view your saved favorites.',
	attachTo: {
		element: "#favorites-button",
		on: "bottom",
	},
	buttons: [
		{
			text: "Back",
			action: tour.back,
		},
		{
			text: "Next",
			action: tour.next,
		},
	],
});

tour.addStep({
	id: "sort",
	title: "Sort Your History",
	text: "Use the dropdown to sort your history by newest or oldest.",
	attachTo: {
		element: "#sort-by",
		on: "bottom",
	},
	buttons: [
		{
			text: "Back",
			action: tour.back,
		},
		{
			text: "Next",
			action: tour.next,
		},
	],
});

tour.addStep({
	id: "date-picker",
	title: "Choose a Date",
	text: "Select a specific date to view your history for that day.",
	attachTo: {
		element: "#date-picker",
		on: "bottom",
	},
	buttons: [
		{
			text: "Back",
			action: tour.back,
		},
		{
			text: "Next",
			action: tour.next,
		},
	],
});

tour.addStep({
	id: "delete-item",
	title: "Delete History Items",
	text: 'Click the "❌" button to delete individual history items.',
	attachTo: {
		element: ".history-item .delete-item",
		on: "bottom",
	},
	buttons: [
		{
			text: "Back",
			action: tour.back,
		},
		{
			text: "Next",
			action: tour.next,
		},
	],
});

tour.addStep({
	id: "delete-confirmation",
	title: "Undo Deletion",
	text: 'If you accidentally delete an item, you can undo it by clicking the "Undo" button in the confirmation popup.',
	buttons: [
		{
			text: "Back",
			action: tour.back,
		},
		{
			text: "Next",
			action: tour.next,
		},
	],
});

tour.addStep({
	id: "finish",
	title: "You're Ready!",
	text: "You've now learned the basics of History Viewer. Enjoy exploring your browsing history!",
	buttons: [
		{
			text: "Back",
			action: tour.back,
		},
		{
			text: "Finish",
			action: tour.complete,
		},
	],
});

helpButton.addEventListener("click", () => {
	tour.start();
});

// Run the tour if it hasn't been seen before
if (localStorage.getItem("seen_tour") === null) {
	tour.start();
	localStorage.setItem("seen_tour", "true");
  }