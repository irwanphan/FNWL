class ApodImage {
    constructor(container) {
        this.container = container;
        this.image = document.createElement('img');
        this.container.innerHTML = '';
        this.container.appendChild(this.image);
    }
  
    updateImage(url, title) {
        this.image.src = url;
        this.image.alt = title;
    }
}

class NeoCard {
    constructor(neo) {
        this.neo = neo;
        this.card = document.createElement('div');
        this.card.classList.add('card');
        this.render();
    }
  
    render() {
        const { name, estimated_diameter, close_approach_data } = this.neo;
    
        const nameElement = document.createElement('h3');
        nameElement.textContent = `Name: ${name}`;
    
        const diameterElement = document.createElement('p');
        const estimatedDiameter = _.get(estimated_diameter, 'kilometers.estimated_diameter_max', 'N/A');
        diameterElement.textContent = `Estimated Diameter: ${estimatedDiameter} km`;
    
        const distanceElement = document.createElement('p');
        const missDistance = _.get(close_approach_data, '[0].miss_distance.kilometers', 'N/A');
        distanceElement.textContent = `Miss Distance: ${missDistance} km`;
    
        this.card.appendChild(nameElement);
        this.card.appendChild(diameterElement);
        this.card.appendChild(distanceElement);
    }
  
    getCardElement() {
        return this.card;
    }
}

export { ApodImage, NeoCard };