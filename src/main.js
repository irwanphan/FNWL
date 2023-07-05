import axios from "axios";
import _ from "lodash";

// my NASA API key
const apiKey = "rrfdoFQbSconvzMXfpu3EJwfqW0eEiIGbc8FSX39";

// Custom element for APOD image
class ApodImage extends HTMLDivElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          text-align: center;
          margin-bottom: 2rem;
        }

        img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        h2 {
          font-size: 1.5rem;
          margin: 0.5rem 0;
        }
      </style>
      <img />
      <h2></h2>
    `;
  }

  updateImage(url, title) {
    const imageElement = this.shadowRoot.querySelector("img");
    const titleElement = this.shadowRoot.querySelector("h2");

    imageElement.src = url;
    titleElement.textContent = title;
  }
}
customElements.define("apod-container", ApodImage, { extends: "div" });

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
    const estimatedDiameterMax = _.get(
      this.neo,
      "estimated_diameter.kilometers.estimated_diameter_max",
      ""
    );
    diameterElement.textContent = `Estimated Diameter: ${estimatedDiameterMax} km`;
    container.appendChild(diameterElement);

    const distanceElement = document.createElement("small");
    const missDistance = _.get(
      this.neo,
      "close_approach_data[0].miss_distance.kilometers",
      ""
    );
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
customElements.define("neo-card", NeoCard);

class NeoCardContainer extends HTMLDivElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }
      </style>
      <slot></slot>
    `;
  }
}
customElements.define("neo-card-container", NeoCardContainer, {
  extends: "div",
});

// Fetch APOD image from NASA API
const fetchApodImage = () => {
  const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`;

  axios
    .get(apiUrl)
    .then((response) => {
      const { url, title } = response.data;
      const apodContainer = document.querySelector("apod-container");
      apodContainer.updateImage(url, title);
    })
    .catch((error) => {
      console.error("Error fetching APOD image:", error);
    });
};

// Fetch NEOs from NASA API
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

document.addEventListener("DOMContentLoaded", () => {
  const apodContainer = document.getElementById("apodContainer");
  const neoCardContainer = document.getElementById("neoCardContainer");

  // Create custom elements
  const apodContainerElement = new ApodImage(apodContainer);
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
