let testData = {
    user: {
        login: "Dummy User",
        avatar: "user_picture.jpg",
        repositories: [
            {
                id: "MDQ6VXNlcjQ4NjY4ODkw",
                name: "Dummy Repo 1",
                description: null,
                isFork: false,
                forkCount: 0,
                stargazerCount: 0,
                licenseInfo: null,
                primaryLanguage: null
            }, {
                id: "MDQ6VXNlcjQ4NjY4ODkw",
                name: "Dummy Repo 2",
                description: "No description",
                isFork: true,
                forkCount: 0,
                stargazerCount: 0,
                licenseInfo: null,
                primaryLanguage: {
                    name: "HTML"
                }
            }, {
                id: "MDQ6VXNlcjQ4NjY4ODkw",
                name: "Dummy Repo 3",
                description: "No description",
                isFork: false,
                forkCount: 3,
                stargazerCount: 1,
                licenseInfo: null,
                primaryLanguage: {
                    name: "Javascript"
                }
            }
        ]
    }
};

const fileTypeAndColor = {
    javascript: "#f3f301",
    python: "#2c7cf3",
    html: " #e42200"
};

const genHex = function (length){
    length = length || 16;
    let counter = 0;
    let generated_hex = "t";
    let characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    while(counter <= length){
        let rand_index = Math.round((Math.random()*characters.length)+1);
        generated_hex += characters.charAt(rand_index);
        counter += 1;
    }
    return generated_hex;
};

const createComponent = function (elementType, value, classList) {
    value = value || null;
    classList = classList || null;

    const component = document.createElement(elementType);
    if (value){
        text = document.createTextNode(value);
        component.appendChild(text);
    }

    if(classList){
        classList.forEach(className => {
            if (className !== null && className !== "null") component.classList.add(className);
        });
    }
    return component;
};

const joinComponent = function (container, ...components) {
    for (let component of components){
        container.appendChild(component);
    }
    return container;
};

const activateToken = function (falseToken) {
    if (typeof falseToken === 'string') return falseToken.split('-T-').join('');
    return null;
};

const displayUserData = userData => {
    // Set username
    document.querySelector("main .user-profile-section .username").textContent = `${userData.login}`;
    // Set profile picture
    document.querySelectorAll("img.user-profile-picture").forEach(element => {
        element.src = userData.avatar;
    });
};

const createRepoItem = function (container, itemList) {
    itemList = itemList.slice(0, 20);
    // Clear dummy load elements in repository container
    container.innerHTML = "";
    // Use data list to create repo and append to DOM
    itemList.forEach(item => {
        let div0 = createComponent("DIV", null, ["cols", "repo-item"]);
            let div1 = createComponent("DIV", null, ["rows"]);
                let div10 = createComponent("DIV", null, ["lg-100", "cols"]);
                    let repoName = createComponent("h3", `${item.name || 'Repository Name'}`, ["repo-item-name"]);
                    let sourceCondition = (item.isFork && item.isFork === true);
                    let repoSource = createComponent("SPAN", `${sourceCondition? 'Forked from another repository' : ''}`, ["repo-item-source", `${sourceCondition? null : 'none'}`]);
                    let repoDesc = createComponent("SPAN", `${item.description}`, ["repo-item-description", `${(item.description)? null : 'none'}`]);
                let button10 = createComponent("BUTTON", null, ["rows", "repo-star-btn"]);
            let div2 = createComponent("DIV", null, ["rows", "repo-item-details"]);
                let repoContains = createComponent("SPAN", null, ["rows", "detail-item", `${(item.primaryLanguage)? null : 'none'}`]);
                let starElement = createComponent("SPAN", null, ["rows", "detail-item", `${(item.stargazerCount && item.stargazerCount > 0)? null : 'none'}`]);
                let forkElement = createComponent("SPAN", null, ["rows", "detail-item", `${(item.forkCount && item.forkCount > 0)? null : 'none'}`]);
                let licenseElement = createComponent("SPAN", null, ["rows", "detail-item", `${(item.licenseInfo)? null : 'none'}`]);
                let updateTime = createComponent("SPAN", `${item.date || 'Updated on July 12'}`, ["rows", "detail-item"]);

        div0.id = item.id;
        button10.innerHTML = `<i class="icon icofont-ui-rate-blank"></i> Star`;
        button10.id = `star-${item.id}`;

        if (item.primaryLanguage) {
            let circleBgColor = fileTypeAndColor[`${item.primaryLanguage.name.toLowerCase()}`] || "#999";
            repoContains.innerHTML = `<i class="icon circle" style="background-color: ${circleBgColor};"></i>${item.primaryLanguage.name}`;
        }

        if (item.stargazerCount) starElement.innerHTML = `<i class="icon icofont-ui-rate-blank"></i>${item.stargazerCount}`;
        if (item.forkCount > 0) forkElement.innerHTML = `<i class="icon icofont-chart-flow-2"></i>${item.forkCount}`;
        if (item.licenseInfo !== null) licenseElement.innerHTML = `<i class="icon icofont-law"></i>${item.licenseInfo.name}`;

        div10 = joinComponent(div10, repoName, repoSource, repoDesc);
        div2 = joinComponent(div2, repoContains, starElement, forkElement, licenseElement, updateTime);
        div1 = joinComponent(div1, div10, button10);
        div0 = joinComponent(div0, div1, div2);
        container.appendChild(div0);
    });

    // Incase user repo list is empty... 
    if (itemList.length === 0) {
        container.innerHTML = `<h4 class="rows no-repo-text">This account does not seem to have any repository yet.</h4>`;
    }
};

let fetchGithubRepo = function(user){
    let repoContainer = document.querySelector(".repository-section #repository-container");
    let repoCountElement = document.querySelector(".repository-section #repo-notice");

    // SWITCH TO DUMMY DATA HANDLER
    const useTestData = function(fetchError) {
        // Use data received fill in user data in DOM
        displayUserData(testData.user);
    
        repoCountElement.innerHTML = testData.user.repositories.length;
        createRepoItem(repoContainer, testData.user.repositories);
        console.error(fetchError);
    };

    // DEFINE ALL FETCH API PARAMETERS
    let apiUrl = "https://api.github.com/graphql";
    let apiBody = { 
        query: `query ($username: String!){
            user(login: $username){
                    login
                    repositories(last: 20){
                        totalCount
                        nodes{
                            id
                            name
                            description
                            isFork
                            forkCount
                            stargazerCount
                            licenseInfo{
                                name
                            }
                            primaryLanguage{
                                name
                            }
                        }
                    }
                }
            }`,

        variables: { "username": `${user.username}`}
    };

    let apiOptions = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + user.token
        },
        body: JSON.stringify(apiBody)
    };

    // Asynchronous fetch from 'apiUrl'
    fetch(apiUrl, apiOptions).then(async response => {
        let result = await response.json();
        if (result.data) { // if fetch was successful...

            // Use data received fill in user data in DOM
            displayUserData(result.data.user);

            // Use data received to create repository in DOM
            let repos = result.data.user.repositories;
            repoCountElement.innerHTML = repos.totalCount;
            createRepoItem(repoContainer, repos.nodes);
        }else{
            // Fallback for error cases
            useTestData(result);
        }
    }).catch(error => {
        // Fallback for error cases
        useTestData(error);
    });
};

//EXECUTE ON DOCUMENT LOAD HERE...
document.addEventListener("DOMContentLoaded", function (ev) {
    let validToken = activateToken('d855-T-524a-T-160e-T-7746-T-5c98-T-5d32ccab16f-T-d92c-T-50e74');
    let user = {
        username: "tehmi2000",
        token: validToken
    };

    fetchGithubRepo(user);
});