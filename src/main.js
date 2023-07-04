import axios from "axios";
import { ApodImage, NeoCard } from "./components.js";

// my NASA API key
const apiKey = "rrfdoFQbSconvzMXfpu3EJwfqW0eEiIGbc8FSX39";

// Function to fetch APOD image from NASA API
const fetchApodImage = () => {
  const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`;

  axios
    .get(apiUrl)
    .then((response) => {
      const { url, title } = response.data;
      const apodContainer = document.getElementById("apodContainer");
      const apodImage = new ApodImage(apodContainer);
      apodImage.updateImage(url, title);
    })
    .catch((error) => {
      console.error("Error fetching APOD image:", error);
    });
};

// Function to fetch NEOs from NASA API
const fetchNEOs = () => {
  const apiUrl = `https://api.nasa.gov/neo/rest/v1/feed?api_key=${apiKey}`;

  axios
    .get(apiUrl)
    .then((response) => {
      const neoData = response.data;
      const neoList = neoData.near_earth_objects;

      const cardContainer = document.getElementById("neoCardContainer");
      cardContainer.innerHTML = "";

      // Create cards for each NEO
      for (const date in neoList) {
        neoList[date].forEach((neo) => {
          const neoCard = new NeoCard(neo);
          cardContainer.appendChild(neoCard.getCardElement());
        });
      }
    })
    .catch((error) => {
      console.error("Error fetching NEOs:", error);
    });
};

// Initialize application
document.addEventListener("DOMContentLoaded", () => {
  // const apodContainer = document.getElementById("apodContainer");
  // const apodImage = new ApodImage(apodContainer);

  // Fetch initial APOD image
  fetchApodImage();
  // fetch NEOs
  fetchNEOs();
});
