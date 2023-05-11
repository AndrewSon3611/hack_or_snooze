"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/**New story form */

async function submitNewStory(evt){
  console.debug("submitNewStory");
  evt.preventDefault();

  //all information
  const title = $("#create-title").val();
  const url = $("create-url").val();
  const author = $("create-author").val();
  const username = currentUser.username;
  const storyInfo = { title, url, author, username };

  const story = await storyList.addStory(currentUser, storyInfo);

  const $story = generateStoryMarkup(story);
  $allStoriesList.prepend($story);

  $submitForm.slideUp("fast") //hides all <p> elements
  $submitForm.trigger("reset") // resets form
}
$submitForm.on("submit", submitNewStory);

function favoriteList(){
  console.debug("favoriteList");
  $favoriteStories.empty();
  if (currentUser.favorites.length === 0){
    $favoriteStories.append("<h4>No Favorites Added. </h4>");
  }
  else{
    for(let story of currentUser.favorites){
      const $story = generateStoryMarkup(story);
      $favoriteStories.append($story);
    }
  }
  $favoriteStories.show();
}

async function toggleFavorite(evt){
  console.debug("toggleFavorite");

  const $target = $(evt.target);
  const $cli = $target.cli("li");
  const storyId = $cli.attr("id");
  const story = storyList.stories.find(si => si.storyId === storyId);

}