document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const historyContainer = document.getElementById('history-container');
    const popup = document.getElementById('popup');
    const deleteButton = document.getElementById('delete-button');
    const favoriteButton = document.getElementById('favorite-button');
    const cancelButton = document.getElementById('cancel-button');
    const favoritesButton = document.getElementById('favorites-button');
    const favoritesContainer = document.getElementById('favorites-container');
    const favoritesList = document.getElementById('favorites-list');
    const sortBySelect = document.getElementById('sort-by');
    const datePicker = document.getElementById('date-picker');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    const loadingIndicator = document.getElementById('loading-indicator');
    const deleteConfirmationPopup = document.getElementById('delete-confirmation');
  
    let selectedItems = [];
    let historyData = [];
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    let currentPage = 1;
    let selectedDate = new Date(); // Start with current date
    let deletedItems = JSON.parse(localStorage.getItem('deletedItems')) || []; // Store deleted items for undo
  
    const renderHistory = (data) => {
      historyContainer.innerHTML = '';
      let currentDate = '';
  
      data.forEach(item => {
        const visitDate = new Date(item.lastVisitTime);
        const visitDateString = new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(visitDate);  
        if (visitDateString !== currentDate) {
          currentDate = visitDateString;
          const dateDiv = document.createElement('div');
          dateDiv.className = 'history-date';
          dateDiv.textContent = currentDate;
          historyContainer.appendChild(dateDiv);
        }
  
        const div = document.createElement('div');
        div.className = 'history-item';
        div.setAttribute('data-id', item.id);
        div.setAttribute('data-is-favorite', favorites.some(fav => fav.id === item.id) ? 'true' : 'false');
        div.innerHTML = `
          <input type="checkbox" data-id="${item.id}">
          <span>${visitDate.toLocaleTimeString()}</span>
          <a href="${item.url}" target="_blank">${item.title || item.url}</a>
          <button class="delete-item" data-id="${item.id}">✖</button> 
        `;
        historyContainer.appendChild(div);
  
        // Add event listener for individual item deletion
        const deleteButton = div.querySelector('.delete-item');
        deleteButton.addEventListener('click', () => {
          const itemId = deleteButton.getAttribute('data-id');
          deleteItem(itemId);
        });
      });
  
      if (data.length === 0) {
        historyContainer.innerHTML = '<p>No results found</p>';
      }
    };
  
    const fetchHistory = (query = '', startTime = 0, endTime = Date.now()) => {
      loadingIndicator.style.display = 'block'; // Show loading indicator
      chrome.history.search({ text: query, startTime, endTime, maxResults: 1000 }, (results) => {
        historyData = results.filter(item => {
          const visitDate = new Date(item.lastVisitTime);
          return visitDate.getDate() === selectedDate.getDate() &&
                 visitDate.getMonth() === selectedDate.getMonth() &&
                 visitDate.getFullYear() === selectedDate.getFullYear();
        });
  
        // Sort historyData after fetching, to maintain chronological order
        historyData.sort((a, b) => a.lastVisitTime - b.lastVisitTime);
  
        renderHistory(historyData);
        loadingIndicator.style.display = 'none'; // Hide loading indicator
      });
    };

    searchButton.addEventListener('click', () => {
      fetchHistory(searchInput.value);
    });
  
    sortBySelect.addEventListener('change', () => {
      const sortedData = [...historyData];
      if (sortBySelect.value === 'newest') {
        sortedData.sort((a, b) => b.lastVisitTime - a.lastVisitTime);
      } else {
        sortedData.sort((a, b) => a.lastVisitTime - b.lastVisitTime);
      }
      renderHistory(sortedData);
    });
  
    datePicker.addEventListener('change', () => {
      selectedDate = new Date(datePicker.value);
      currentPage = 1; // Reset page to 1 when changing date
      fetchHistory();
    });
  
    prevButton.addEventListener('click', () => {
      currentPage--;
      if (currentPage < 1) {
        currentPage = 1;
      }
      // Fetch history for the previous day
      selectedDate = new Date(selectedDate.getTime() - 24 * 60 * 60 * 1000); // Subtract one day
      fetchHistory();
    });
  
    nextButton.addEventListener('click', () => {
      currentPage++;
      // Fetch history for the next day
      selectedDate = new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000); // Add one day
      fetchHistory();
    });
  
    document.addEventListener('change', (e) => {
      if (e.target.matches('.history-item input[type="checkbox"]')) {
        const id = e.target.getAttribute('data-id');
        if (e.target.checked) {
          selectedItems.push(id);
        } else {
          selectedItems = selectedItems.filter(item => item !== id);
        }
        popup.style.display = selectedItems.length > 0 ? 'block' : 'none';
      }
    });
  
    deleteButton.addEventListener('click', () => {
      selectedItems.forEach(id => {
        deleteItem(id); // Call deleteItem for each selected item
      });
      selectedItems = [];
      popup.style.display = 'none';
    });
  
    favoriteButton.addEventListener('click', () => {
      selectedItems.forEach(id => {
        const item = historyData.find(entry => entry.id === id);
        if (item && !favorites.some(fav => fav.id === item.id)) {
          favorites.push(item);
        }
      });
      localStorage.setItem('favorites', JSON.stringify(favorites));
      selectedItems = [];
      popup.style.display = 'none';
      renderHistory(historyData); // Update to reflect favorite status
    });
  
    cancelButton.addEventListener('click', () => {
      selectedItems = []; // Reset selected items on cancel
      popup.style.display = 'none';
    });
  
    favoritesButton.addEventListener('click', () => {
      const isFavoritesVisible = favoritesContainer.style.display === 'block';
      favoritesContainer.style.display = isFavoritesVisible ? 'none' : 'block';
      historyContainer.style.display = isFavoritesVisible ? 'block' : 'none';
      if (!isFavoritesVisible) {
        renderFavorites();
        // Update the heading
        const pageHeading = document.getElementById('page-heading');
        pageHeading.textContent = 'Favorites'; 
      } else {
        // Update the heading back to "History Viewer"
        const pageHeading = document.getElementById('page-heading');
        pageHeading.textContent = 'History Viewer'; 
      }
    });
  
    const renderFavorites = () => {
      favoritesList.innerHTML = '';
      favorites.forEach(item => {
        const div = document.createElement('div');
        div.className = 'history-item';
        div.innerHTML = `
          <span>${new Date(item.lastVisitTime).toLocaleTimeString()}</span>
          <a href="${item.url}" target="_blank">${item.title || item.url}</a>
          <button class="remove-favorite" data-id="${item.id}">Remove</button>
        `;
        favoritesList.appendChild(div);
      });
  
      if (favorites.length === 0) {
        favoritesList.innerHTML = '<p>No favorites found</p>';
      }
  
      // Add event listener for removing favorites
      const removeFavoriteButtons = document.querySelectorAll('.remove-favorite');
      removeFavoriteButtons.forEach(button => {
        button.addEventListener('click', () => {
          const itemId = button.getAttribute('data-id');
          favorites = favorites.filter(fav => fav.id !== itemId);
          localStorage.setItem('favorites', JSON.stringify(favorites));
          renderFavorites();
          renderHistory(historyData); // Update to reflect favorite status
        });
      });
    };
  
    const deleteItem = (itemId) => {
      chrome.history.deleteUrl({ url: itemId }, () => {
        // Add item to deletedItems array for undo
        deletedItems.push(itemId);
  
        // Update historyData to reflect the deletion
        historyData = historyData.filter(item => item.id !== itemId);
  
        // Update history display
        renderHistory(historyData);
  
        // Show delete confirmation popup
        showDeleteConfirmation(itemId);
        // Store deleted items in local storage
        localStorage.setItem('deletedItems', JSON.stringify(deletedItems)); 
      });
    };
  
    const showDeleteConfirmation = (itemId) => {
      const item = historyData.find(entry => entry.id === itemId);
      const itemName = item ? item.title || item.url : 'History Entry';
      deleteConfirmationPopup.style.display = 'block';
      deleteConfirmationPopup.querySelector('.message').textContent = `Deleted ${itemName}`;
      // Add event listener to Undo button
      const undoButton = deleteConfirmationPopup.querySelector('.undo-button');
      undoButton.addEventListener('click', () => {
        undoDelete(itemId);
      });
      // Animate the progress bar
      const progressBar = deleteConfirmationPopup.querySelector('.progress-bar');
      const animation = progressBar.animate(
        [{ width: '100%' }, { width: '0%' }],
        { duration: 3000, easing: 'linear', fill: 'forwards' }
      );
      animation.onfinish = () => {
        deleteConfirmationPopup.style.display = 'none';
      };
    };
  
    const undoDelete = (itemId) => {

      // Find the deleted item in historyData
      const deletedItem = historyData.find(item => item.id === itemId);
      if (deletedItem) {
        // Add the item back to history
        chrome.history.addUrl({ url: deletedItem.url }, () => {
          // Remove the item from deletedItems array
          deletedItems = deletedItems.filter(id => id !== itemId);
          // Add the item back to historyData (in the correct position)
          const index = historyData.findIndex(item => item.lastVisitTime > deletedItem.lastVisitTime);
          if (index > -1) {
            historyData.splice(index, 0, deletedItem);
          } else {
            historyData.push(deletedItem);
          }
          // Update history display
          renderHistory(historyData);
  
          // Store deleted items in local storage
          localStorage.setItem('deletedItems', JSON.stringify(deletedItems)); 
        });
      }
    };
  
    // Load all history items initially
    fetchHistory();
  });