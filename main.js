(function () {
  //selection
  const form = document.querySelector("form");
  const tweetInputElem = document.querySelector(".tweet-input");
  const filterInputElem = document.querySelector(".filter");
  const tweetListElem = document.querySelector(".collection");
  const submitBtn = document.querySelector(".submit-btn");
  const updateBtn = document.querySelector(".update-btn");
  const msg = document.querySelector(".msg");
  const countInputChar = document.querySelector(".count-character");


  const setDataToLocalStorage = (data) => localStorage.setItem("tweetItems", JSON.stringify(data));
  const getParsedDataFromLocalStorage = () => JSON.parse(localStorage.getItem("tweetItems"));

  const saveDataToLocalStorage = (tweet) => {
    let tweets = "";
    if (localStorage.getItem("tweetItems") === null) {
      tweets = [];
      tweets.push(tweet);
      setDataToLocalStorage(tweets);
    } else {
      tweets = getParsedDataFromLocalStorage()
      tweets.push(tweet);
      setDataToLocalStorage(tweets);
    }
  };

  const getDataFromLocalStorage = () => {
    let tweets = "";
    if (localStorage.getItem("tweetItems") === null) {
      tweets = [];
    } else {
      tweets = getParsedDataFromLocalStorage()
    }
    return tweets;
  };

  const deleteDataFromLocalStorage = (id) => {
    let tweets = getParsedDataFromLocalStorage()
    const filteredTweets = tweets.filter((tweet) => tweet.id !== id);
    setDataToLocalStorage(filteredTweets);
    filteredTweets.length === 0 && location.reload();
  };

  //all tweet data
  // let tweetData = [];
  let tweetData = getDataFromLocalStorage();

  //load all event listeners
  const loadEventListener = () => {
    form.addEventListener("click", addOrUpdateTweet);
    tweetInputElem.addEventListener("keyup", countCharacter);
    tweetListElem.addEventListener("click", editOrDeleteTweet);
    filterInputElem.addEventListener("keyup", filterTweet);
    window.addEventListener(
      "DOMContentLoaded",
      displayTweet.bind(null, tweetData)
    );
  };

  const showMessage = (message = "") => {
    msg.innerText = message;
  };

  tweetData.length === 0 && showMessage("No Tweet Available!!");

  //calculate input character count
  const countCharacter = (e) => countInputChar.innerText = `${e.target.value.length}/150`;
  
  const addOrUpdateTweet = (e) => {
    e.preventDefault();

    if (e.target.classList.contains("submit-btn")) {
      addTweetAction();
    } else if (e.target.classList.contains("update-btn")) {
      updateTweetAction();
      resetUI();
    }
  };

  const addTweetAction = () => {
    let id;
    tweetData.length === 0
      ? (id = 0)
      : (id = tweetData[tweetData.length - 1].id + 1);

    let time = new Date();
    let tweetTime = time.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    const text = tweetInputElem.value;
    if (text === "") {
      alert("Please add a tweet");
    } else {
      const data = { id, text, tweetTime };
      tweetData.push(data);
      saveDataToLocalStorage(data);
      displayTweet(tweetData);
      tweetInputElem.value = "";
    }
  };

  const resetUI = () => {
    tweetInputElem.value = "";
    document.querySelector("#id").remove();
    submitBtn.style.display = "block";
    document.querySelector(".update-btn").remove();
  };

  const updateTweetAction = () => {
    const hiddenInput = document.querySelector("#id");
    const hiddenInputVal = parseInt(hiddenInput.value);
    const findTweet = tweetData.find((t) => t.id === hiddenInputVal);
    findTweet.text = tweetInputElem.value;
    setDataToLocalStorage(tweetData);
    displayTweet(tweetData);
  };

  const displayTweet = (tweetData) => {
    tweetListElem.innerHTML = "";
    tweetData.length > 0 && (msg.innerText = "");

    tweetData.forEach(({ id, text, tweetTime }) => {
      let li = document.createElement("li");
      li.className = "tweet-item mb-3";
      li.id = `product-${id}`;
      li.innerHTML = `
      <div class='d-flex align-items-start justify-content-between'>
      <div>
        <span>${text} </span>
        <span class='me-2 ms-2 fw-bold'>${tweetTime}</span>
      </div>
      <div class='d-flex'>
        <button class='btn btn-outline-secondary me-2 py-1 edit-btn'>Edit</button>
        <button class='btn btn-outline-danger py-1 delete-btn'>Delete</button>
      </div>
      </div>`;
      tweetListElem.appendChild(li);
    });
  };
  // displayTweet(tweetData);

  const editOrDeleteTweet = (e) => {
    const target = e.target.parentElement.parentElement.parentElement;
    const id = parseInt(target.id.split("-")[1]);

    if (e.target.classList.contains("delete-btn")) {
      tweetListElem.removeChild(target);
      //delete from data store
      const filteredTweet = tweetData.filter((t) => t.id !== id);
      tweetData = filteredTweet;
      deleteDataFromLocalStorage(id);
    } else if (e.target.classList.contains("edit-btn")) {
      const tweetText =
        e.target.parentElement.parentElement.firstElementChild.firstElementChild
          .textContent;
      tweetInputElem.value = tweetText;
      populateEditTweet(id);
    }
  };

  const populateEditTweet = (id) => {
    const idElem = `<input type="hidden" value=${id} id="id"/>`;
    const btnElem =
      "<button class='btn btn-danger w-100 mt-3 update-btn'>Update</button>";

    const hiddenInput = document.querySelector("#id");
    hiddenInput && hiddenInput.setAttribute("value", id);

    if (!updateBtn) {
      form.insertAdjacentHTML("beforeend", idElem);
      form.insertAdjacentHTML("beforeend", btnElem);
    }
    submitBtn.style.display = "none";
  };

  const filterTweet = (e) => {
    const text = e.target.value.toLocaleString();
    let itemLength = 0;

    document.querySelectorAll(".collection .tweet-item").forEach((item) => {
      const tweetText =
        item.firstElementChild.firstElementChild.firstElementChild.textContent.toLocaleLowerCase();
      if (tweetText.indexOf(text) === -1) {
        item.style.display = "none";
      } else {
        item.style.display = "block";
        ++itemLength;
      }
    });

    itemLength > 0 ? showMessage() : showMessage("No Tweet Found!");
  };

  loadEventListener();
})();
