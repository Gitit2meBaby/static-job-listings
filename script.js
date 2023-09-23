document.addEventListener('DOMContentLoaded', () => {
    const app = document.querySelector('.app');
    const modal = document.querySelector('.modal');
    const filterTags = document.querySelector('.filter-tags');
    const clearBtn = document.querySelector('#clear')

    // eventListener for tags to append to modal
    app.addEventListener('click', (event) => {
        if (event.target.classList.contains('tag')) {
            const tagType = event.target.getAttribute('data-tag');
            modal.classList.remove('hidden');
            createAppendedTag(tagType);
            filterByTags();
        }
    });

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
          <div class="tag" data-tag="${job.level}">${job.level}</div>
          <div class="tag" data-tag="${job.role}">${job.role}</div>
        </div>
        `;

                // add the NEW! div 
                if (job.new == true) {
                    const newTag = jobListing.querySelector('.tag-new');
                    newTag.classList.remove('hidden');
                }
                //add the featured div, and featured border
                if (job.featured == true) {
                    const featuredTag = jobListing.querySelector('.tag-featured');
                    featuredTag.classList.remove('hidden');
                    jobListing.classList.add('featured');
                }

                //iterate through the JSON file to find required tags
                const tagsContainer = jobListing.querySelector('.tags');
                if (job.languages.length > 0) {
                    job.languages.forEach((language) => {
                        createTag(tagsContainer, language);
                    });
                }
                if (job.tools.length > 0) {
                    job.tools.forEach((tool) => {
                        createTag(tagsContainer, tool);
                    });
                }

                app.appendChild(jobListing);
            });
        })
        .catch((error) => console.error('Error fetching data:', error));

    //create tags for each container (job listing)
    function createTag(container, text) {
        const addTag = document.createElement('div');
        addTag.classList.add('tag');
        addTag.textContent = text;
        addTag.setAttribute('data-tag', text);
        container.appendChild(addTag);
    }

    // Create an appended tag in the modal
    function createAppendedTag(tagName) {
        const appendedTag = document.createElement('div');
        appendedTag.classList.add('tag-appended');
        appendedTag.setAttribute('data-tag', tagName);
        appendedTag.innerHTML = appendedTagHTML(tagName);
        filterTags.appendChild(appendedTag);

        const closeBtn = document.querySelectorAll('.close-btn')
        closeBtn.forEach((btn) => {
            btn.addEventListener('click', () => {
                appendedTag.remove();
                filterByTags();
                checkForEmptyModal();
            });

        })
    }

    // appended tag (tags in modal) template
    function appendedTagHTML(tagName) {
        return `
    <div class="tag-title">
        <p>${tagName}</p>
    </div>
    <div class="close-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14">
            <path fill="#FFF" fill-rule="evenodd"
                d="M11.314 0l2.121 2.121-4.596 4.596 4.596 4.597-2.121 2.121-4.597-4.596-4.596 4.596L0 11.314l4.596-4.597L0 2.121 2.121 0l4.596 4.596L11.314 0z" />
        </svg>
    </div>
`;
    }

    // Store the selected tags in an array
    let selectedTags = [];

    // Filter the containers by data attribute
    function filterByTags() {
        selectedTags.length = 0;
        const appendedTags = modal.querySelectorAll('.tag-appended');

        appendedTags.forEach((appendedTag) => {
            const tagType = appendedTag.getAttribute('data-tag');
            selectedTags.push(tagType);
        });

        // Iterate through each job listing (container)
        const jobListings = document.querySelectorAll('.container');
        jobListings.forEach((jobListing) => {
            const tags = jobListing.querySelectorAll('.tag');

            const containsAllSelectedTags = selectedTags.every((selectedTag) => {
                return Array.from(tags).some((tag) => tag.getAttribute('data-tag') === selectedTag);
            });

            if (!containsAllSelectedTags) {
                jobListing.classList.add('hidden')
            }
            if (containsAllSelectedTags) {
                jobListing.classList.remove('hidden')
            }

        });
    }

    // clear all tags from Modal
    clearBtn.addEventListener('click', () => {
        selectedTags = [];
        filterByTags();
        const jobListings = document.querySelectorAll('.container');
        jobListings.forEach((jobListing) => {
            jobListing.classList.remove('hidden');
        });

        const appendedTags = modal.querySelectorAll('.tag-appended');
        appendedTags.forEach((appendedTag) => {
            appendedTag.remove();
        });

        checkForEmptyModal()
    });

    function checkForEmptyModal() {
        const filterTags = document.querySelector('.filter-tags');

        if (filterTags.childElementCount === 0) {
            modal.classList.add('hidden')
        }
    }
});