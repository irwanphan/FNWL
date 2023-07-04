import axios from "axios";
import _ from "lodash";

// my NASA API key
const apiKey = "rrfdoFQbSconvzMXfpu3EJwfqW0eEiIGbc8FSX39";

// Custom element for APOD image
class ApodContainer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.render();
  }

  render() {
    const container = document.createElement("div");
    container.setAttribute("id", "apodContainer");

    this.shadowRoot.appendChild(container);
  }
}

// Define the custom element
customElements.define("apod-container", ApodContainer);

// Custom element for NEO card
class NeoCard extends HTMLElement {
  constructor(neo) {
    super();
    this.attachShadow({ mode: "open" });
    this.neo = neo;
    this.render();
  }

  render() {
    const container = document.createElement("div");
    container.classList.add("neo-card");

    const nameElement = document.createElement("h3");
    nameElement.textContent = _.get(this.neo, "name", "");
    container.appendChild(nameElement);

    const diameterElement = document.createElement("small");
    const estimatedDiameterMax = _.get(this.neo, "estimated_diameter.kilometers.estimated_diameter_max", "");
    diameterElement.textContent = `Estimated Diameter: ${estimatedDiameterMax} km`;
    container.appendChild(diameterElement);

    const distanceElement = document.createElement("small");
    const missDistance = _.get(this.neo, "close_approach_data[0].miss_distance.kilometers", "");
    distanceElement.textContent = `Miss Distance: ${missDistance} km`;
    container.appendChild(distanceElement);

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }
        .neo-card {
          background-color: #f5f5f5;
          border-radius: 0.5rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          padding: 1.25rem;
          margin-bottom: 1.25rem;
        }

        .neo-card h3 {
          font-size: 1.25rem;
          font-weight: bold;
          margin-top: 0;
          margin-bottom: 0.5rem;
        }

        .neo-card small {
          display: block;
          font-size: 0.75rem;
          margin-bottom: 0.125rem;
        }
      </style>
    `;

    this.shadowRoot.appendChild(container);
  }
}

// Define the custom element
customElements.define("neo-card", NeoCard);

// Function to fetch APOD image from NASA API
const fetchApodImage = () => {
  const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`;

  axios
    .get(apiUrl)
    .then((response) => {
      const { url, title } = response.data;
      const apodContainer = document.getElementById("apodContainer");
      apodContainer.innerHTML = `<img src="${url}" alt="${title}" />`;
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
          cardContainer.appendChild(neoCard);
        });
      }
    })
    .catch((error) => {
      console.error("Error fetching NEOs:", error);
    });
};

// Initialize application
document.addEventListener("DOMContentLoaded", () => {
  const apodContainer = document.getElementById("apodContainer");
  const neoCardContainer = document.getElementById("neoCardContainer");

  // Create custom elements
  const apodContainerElement = new ApodContainer();
  const neoCardContainerElement = document.createElement("div");
  neoCardContainerElement.setAttribute("id", "neoCardContainer");

  // Append custom elements to the containers
  apodContainer.appendChild(apodContainerElement);
  neoCardContainer.appendChild(neoCardContainerElement);

  // Fetch initial APOD image
  fetchApodImage();
  // Fetch NEOs
  fetchNEOs();
});
