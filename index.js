import { tweetsData } from "./data.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";

const tweetText = document.getElementById("tweet-input");
const tweetBtn = document.getElementById("tweet-btn");

tweetBtn.addEventListener("click", addNewTweet);

document.addEventListener("click", function (e) {
  if (e.target.dataset.like) {
    handleLikeClick(e.target.dataset.like);
  } else if (e.target.dataset.retweet) {
    handleRetweetClick(e.target.dataset.retweet);
  } else if (e.target.dataset.reply) {
    handleReplyClick(e.target.dataset.reply);
  } else if (e.target.id === "reply-btn") {
    const tweetId = e.target.dataset.id;
    const replyText = document.getElementById(`reply-input-${tweetId}`).value;

    const targetTweetObj = tweetsData.filter(function (tweet) {
      return tweet.uuid === tweetId;
    })[0];

    targetTweetObj.replies.push({
      handle: `@Sarina`,
      profilePic: `images/tweeterlogo.png`,
      tweetText: replyText,
    });

    render();
    handleReplyClick(tweetId);
  }
});

function addNewTweet() {
  const tweet = {
    handle: `@Sarina`,
    profilePic: `images/tweeterlogo.png`,
    likes: 0,
    retweets: 0,
    tweetText: tweetText.value,
    replies: [],
    isLiked: false,
    isRetweeted: false,
    uuid: uuidv4(),
  };
  //   const tweetHtml = renderTweet(tweet);

  tweetsData.unshift(tweet);
  tweetText.value = "";
  render();
}

function handleLikeClick(tweetId) {
  const targetTweetObj = tweetsData.filter(function (tweet) {
    return tweet.uuid === tweetId;
  })[0];

  if (targetTweetObj.isLiked) {
    targetTweetObj.likes--;
  } else {
    targetTweetObj.likes++;
  }
  targetTweetObj.isLiked = !targetTweetObj.isLiked;
  render();
}

function handleRetweetClick(tweetId) {
  const targetTweetObj = tweetsData.filter(function (tweet) {
    return tweet.uuid === tweetId;
  })[0];

  if (targetTweetObj.isRetweeted) {
    targetTweetObj.retweets--;
  } else {
    targetTweetObj.retweets++;
  }
  targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted;
  render();
}

function handleReplyClick(tweetId) {
  document.getElementById(`replies-${tweetId}`).classList.toggle("hidden");
}

function renderTweet(tweet) {
  let likeIconClass = "";

  if (tweet.isLiked) {
    likeIconClass = "liked";
  }

  let retweetIconClass = "";

  if (tweet.isRetweeted) {
    retweetIconClass = "retweeted";
  }

  let repliesHtml = "";

  if (tweet.replies.length > 0) {
    tweet.replies.forEach(function (reply) {
      repliesHtml += `
            <div class="tweet-reply">
                <div class="tweet-inner">
                    <img src="${reply.profilePic}" class="profile-pic">
                <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
                </div>
            </div>
            </div>
            `;
    });
  }

  return `
        <div class="tweet">
            <div class="tweet-inner">
                <img src="${tweet.profilePic}" class="profile-pic">
                <div>
                    <p class="handle">${tweet.handle}</p>
                    <p class="tweet-text">${tweet.tweetText}</p>
                    <div class="tweet-details">
                        <span class="tweet-detail">
                            <i class="fa-regular fa-comment-dots"
                            data-reply="${tweet.uuid}"
                            ></i>
                            ${tweet.replies.length}
                        </span>
                        <span class="tweet-detail">
                            <i class="fa-solid fa-heart ${likeIconClass}"
                            data-like="${tweet.uuid}"
                            ></i>
                            ${tweet.likes}
                        </span>
                        <span class="tweet-detail">
                            <i class="fa-solid fa-retweet ${retweetIconClass}"
                            data-retweet="${tweet.uuid}"
                            ></i>
                            ${tweet.retweets}
                        </span>
                    </div>   
                </div>            
            </div>
            <div class="hidden" id="replies-${tweet.uuid}">
                        ${repliesHtml}
                        <textarea placeholder="add reply!" class="replyClass" id="reply-input-${tweet.uuid}"></textarea>
                        <button id="reply-btn" class="replyBtn" data-id="${tweet.uuid}">reply</button>
            </div>   
        </div>`;
}

function tweetsInHtml() {
  let tweetContainer = "";

  tweetsData.forEach(function (tweet) {
    tweetContainer += renderTweet(tweet);
  });

  return tweetContainer;
}

function render() {
  document.getElementById("feed").innerHTML = tweetsInHtml();
}

render();
