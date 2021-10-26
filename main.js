(function () {
  //selection
  const form = document.querySelector("form");
  const tweetInputElem = document.querySelector(".tweet-input");
  const filterInputElem = document.querySelector(".filter");
  const tweetListElem = document.querySelector(".collection");
  const submitBtn = document.querySelector(".submit-btn");
  const updateBtn = document.querySelector(".update-btn");
  const msg = document.querySelector(".msg");

  //all tweet data
  let tweetData = [];

  //load all event listeners
  const loadEventListener = () => {
    form.addEventListener("click", addOrUpdateTweet);
    tweetListElem.addEventListener("click", editOrDeleteTweet);
    filterInputElem.addEventListener("keyup", filterTweet);
  };

  const showMessage = (message = "") => {
    msg.innerText = message;
  };

  tweetData.length === 0 && showMessage("No Tweet Available!!");

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
    console.log(tweetTime);

    const text = tweetInputElem.value;
    if (text === "") {
      alert("Please add a tweet");
    } else {
      tweetData.push({ id, text, tweetTime });
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
    displayTweet(tweetData);
  };

  const displayTweet = (tweetData) => {
    tweetListElem.innerHTML = "";
    msg.innerText = "";

    tweetData.forEach(({ id, text, tweetTime }) => {
      let li = document.createElement("li");
      li.className = "tweet-item mb-3";
      li.id = `product-${id}`;
      li.innerHTML = `
      <div class='d-flex align-items-start justify-content-between'>
        <span class='me-2'>${text} <span class='ms-2 fw-bold'>${tweetTime}</span></span>
        <div class='d-flex'>
          <button class='btn btn-outline-secondary me-2 py-1 edit-btn'>Edit</button>
          <button class='btn btn-outline-danger py-1 delete-btn'>Delete</button>
        </div>
      </div>`;
      tweetListElem.appendChild(li);
    });
  };

  const editOrDeleteTweet = (e) => {
    const target = e.target.parentElement.parentElement.parentElement;
    const id = parseInt(target.id.split("-")[1]);

    if (e.target.classList.contains("delete-btn")) {
      tweetListElem.removeChild(target);
      //delete from data store
      const filteredTweet = tweetData.filter((t) => t.id !== id);
      tweetData = filteredTweet;
    } else if (e.target.classList.contains("edit-btn")) {
      const tweetText =
        e.target.parentElement.parentElement.firstElementChild.textContent;
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
        item.firstElementChild.firstElementChild.textContent.toLocaleLowerCase();
      if (tweetText.indexOf(text) === -1) {
        item.style.display = "none";
      } else {
        item.style.display = "block";
        ++itemLength;
      }
    });

    itemLength > 0 ? showMessage() : showMessage("No Tweet Found!");
  };
  // var time = new Date();
  // console.log(
  //   time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
  // );
  loadEventListener();
})();
