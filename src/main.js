import axios from 'axios';

// Custom component for APOD image
class ApodImage {
  constructor(container) {
    this.container = container;
    this.image = document.createElement('img');
    this.container.appendChild(this.image);
  }

  updateImage(url, title) {
    this.image.src = url;
    this.image.alt = title;
  }
}

// my NASA API key
const apiKey = 'rrfdoFQbSconvzMXfpu3EJwfqW0eEiIGbc8FSX39';

// Function to fetch APOD image from NASA API
const fetchApodImage = () => {
  const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`;

  axios
    .get(apiUrl)
    .then(response => {
      const { url, title } = response.data;
      const apodContainer = document.getElementById('apodContainer');
      const apodImage = new ApodImage(apodContainer);
      apodImage.updateImage(url, title);
    })
    .catch(error => {
      console.error('Error fetching APOD image:', error);
    });
};

// Function to fetch NEOs from NASA API
const fetchNEOs = () => {
    const apiKey = 'YOUR_API_KEY'; // Replace with your actual API key
    const apiUrl = `https://api.nasa.gov/neo/rest/v1/feed?api_key=${apiKey}`;
  
    axios
      .get(apiUrl)
      .then(response => {
        const neoData = response.data;
        // Process and display the NEO data as per your requirements
        console.log(neoData);
      })
      .catch(error => {
        console.error('Error fetching NEOs:', error);
      });
};

// Button click event listener
function handleReloadButtonClick() {
  fetchApodImage();
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  const apodContainer = document.getElementById('apodContainer');
  const apodImage = new ApodImage(apodContainer);

  // Add a button to reload the image
  const reloadButton = document.createElement('button');
  reloadButton.textContent = 'Reload Image';
  reloadButton.addEventListener('click', handleReloadButtonClick);
  apodContainer.appendChild(reloadButton);

  // Fetch the initial APOD image
  fetchApodImage();
});


// Call the function to fetch NEOs
fetchNEOs();