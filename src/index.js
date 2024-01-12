document.addEventListener('DOMContentLoaded', () => {
    const dogForm = document.getElementById('dog-form');
    const tableBody = document.getElementById('table-body');
  
    // Function to fetch dogs from the API and render them in the table
    const renderDogs = async () => {
      try {
        const response = await fetch('http://localhost:3000/dogs');
        const dogs = await response.json();
  
        // Render each dog in the table
        dogs.forEach(dog => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${dog.name}</td>
            <td>${dog.breed}</td>
            <td>${dog.sex}</td>
            <td><button class="edit-btn" data-id="${dog.id}">Edit</button></td>
          `;
          tableBody.appendChild(row);
        });
  
        // Add event listeners to edit buttons
        const editButtons = document.querySelectorAll('.edit-btn');
        editButtons.forEach(button => {
          button.addEventListener('click', async (event) => {
            const dogId = event.target.dataset.id;
            // Fetch the specific dog data for editing
            const dogResponse = await fetch(`http://localhost:3000/dogs/${dogId}`);
            const editedDog = await dogResponse.json();
  
            // Populate the form with the selected dog's information
            dogForm.name.value = editedDog.name;
            dogForm.breed.value = editedDog.breed;
            dogForm.sex.value = editedDog.sex;
  
            // Add a custom attribute to the form to store the dog's ID
            dogForm.setAttribute('data-id', editedDog.id);
          });
        });
      } catch (error) {
        console.error('Error fetching and rendering dogs:', error);
      }
    };
  
    // Event listener for form submission
    dogForm.addEventListener('submit', async (event) => {
      event.preventDefault();
  
      const dogId = dogForm.getAttribute('data-id');
      const updatedDog = {
        name: dogForm.name.value,
        breed: dogForm.breed.value,
        sex: dogForm.sex.value
      };
  
      try {
        // Make a PATCH request to update the dog information
        await fetch(`http://localhost:3000/dogs/${dogId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedDog),
        });
  
        // Clear the form
        dogForm.reset();
  
        // Refresh the table with the updated dog information
        renderDogs();
      } catch (error) {
        console.error('Error updating dog information:', error);
      }
    });
  
    // Initial rendering of dogs on page load
    renderDogs();
  });
  