document.addEventListener('DOMContentLoaded', () => {

    const app = document.querySelector('.app')
    const container = document.querySelector('.container')

    fetch('data.json')
        .then(response => response.json())
        .then(data => {

            data.forEach(job => {
                const jobListing = document.createElement('div');
                jobListing.classList.add('container');

                jobListing.innerHTML = `
        <div class="info">
          <div class="logo-container">
            <img src="${job.logo}" alt="${job.company} logo">
          </div>
          <div class="content-container">
            <div class="company-container">
              <p>${job.company}</p>
              <div class="tag-new hidden">New!</div>
              <div class="tag-featured hidden">Featured</div>
            </div>
            <div class="position-name-wrapper">
              <h1>${job.position}</h1>
            </div>
            <div class="position-info-wrapper">
              <p>${job.postedAt}</p>
              <p>*</p>
              <p>${job.contract}</p>
              <p>*</p>
              <p>${job.location}</p>
            </div>
          </div>
        </div>

        <div class="tags">
          <div class="tag">Frontend</div>
          <div class="tag">Senior</div>
        </div>
        `;

                if (job.new == true) {
                    const newTag = jobListing.querySelector('.tag-new');
                    newTag.classList.remove('hidden')
                }
                if (job.featured == true) {
                    const featuredTag = jobListing.querySelector('.tag-featured');
                    featuredTag.classList.remove('hidden')
                    jobListing.classList.add('featured')
                }

                app.appendChild(jobListing);
            })


        })
        .catch(error => console.error('Error fetching data:', error));




})