fetchTweets(); // run on page load
setInterval(fetchTweets, 120000); // then every 2 minuites

var timeSince = function(date) {
    if (typeof date !== 'object') {
        date = new Date(date);
    }

    var seconds = Math.floor((new Date() - date) / 1000);
    var intervalType;

    var interval = Math.floor(seconds / 31536000);
    if (interval >= 1) {
        intervalType = 'year';
    } else {
        interval = Math.floor(seconds / 2592000);
        if (interval >= 1) {
            intervalType = 'month';
        } else {
            interval = Math.floor(seconds / 86400);
            if (interval >= 1) {
                intervalType = 'day';
            } else {
                interval = Math.floor(seconds / 3600);
                if (interval >= 1) {
                    intervalType = "hour";
                } else {
                    interval = Math.floor(seconds / 60);
                    if (interval >= 1) {
                        intervalType = "minute";
                    } else {
                        interval = seconds;
                        intervalType = "second";
                    }
                }
            }
        }
    }

    if (interval > 1 || interval === 0) {
        intervalType += 's';
    }

    return interval + ' ' + intervalType;
};

function fetchTweets() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {

      var tweets = JSON.parse(this.response);

      // tweets loaded, now display
      var tweetsSectionOnPage = document.getElementById("tweets");
      var tweetsOnPage = tweetsSectionOnPage.getElementsByClassName("tweet");

      // remove loading

      var loading = tweetsSectionOnPage.getElementsByClassName("loading");
      while (loading[0]) {
        loading[0].parentNode.removeChild(loading[0]);
      }

      if (tweets.length != 2) {
        return false;
      }

      // remove old tweets
      for (var i = 0; i < tweetsOnPage.length; i++) {
        var tweetOnPage = tweetsOnPage[i];
        var isTweetInAjax = false;

        // tweets in ajax response
        for (var j = 0; j < tweets.length; j++) {
          var tweet = tweets[j];
          // if tweet is in ajax response, leave on page, otherwise delete
          if (tweetOnPage.id == "tweet-" + tweet.id_str) {
            isTweetInAjax = true;
          }
        }
        if (!isTweetInAjax)
        {
          tweetOnPage.parentNode.removeChild(tweetOnPage);
        }
      }

      // add new tweets

      // tweets from json (work though backwards - we always prepend, so last tweet needs prepending first)
      for (var i = (tweets.length - 1); i >= 0; i--) {
        var tweet = tweets[i];
        var isTweetOnPage = false;

        // tweets from html page
        for (var j = 0; j < tweetsOnPage.length; j++) {
          var tweetHtml = tweetsOnPage[j];
          // if tweet not on page, add it

          if (tweetHtml.id == "tweet-" + tweet.id_str) {
            isTweetOnPage = true;
          }
        }
        if (!isTweetOnPage)
        {
          // add tweet to page
          var newTweet = document.createElement("div");
          newTweet.classList.add("tweet");
          newTweet.id = "tweet-" + tweet.id_str;

            var link = document.createElement("a");
            link.setAttribute("target", "_blank");
            link.setAttribute("href", "https://twitter.com/statuses/" + tweet.id_str);
            link.classList.add("no-highlight");

              var p1 = document.createElement("p");
              p1.appendChild(document.createTextNode(tweet.user.name + " "));
                var screenName = document.createElement("small");
                screenName.appendChild(document.createTextNode("@" + tweet.user.screen_name));
              p1.appendChild(screenName);
            link.appendChild(p1);

              var p2 = document.createElement("p");
              p2.classList.add("text");
              // make #hashtags and @user into links
              var textWithLinks = tweet.text.replace(/#(\w*)/g,'<a href="https://twitter.com/hashtag/$1">#$1</a>');
              textWithLinks = textWithLinks.replace(/@(\w*)/g,'<a href="https://twitter.com/$1">@$1</a>');
              p2.innerHTML = textWithLinks;
            link.appendChild(p2);

          newTweet.appendChild(link);

            var actions = document.createElement("small");
              var time = document.createElement("time");
              time.appendChild(document.createTextNode(timeSince(tweet.created_at) + " ago")); // fix into plain english "x hrs ago"
            actions.appendChild(time);

              var reply = document.createElement("a");
              reply.setAttribute("target", "_blank");
              reply.setAttribute("href", "https://twitter.com/intent/tweet?in_reply_to=" + tweet.id_str);
                var replyText = document.createElement("span");
                replyText.classList.add("hidden");
                replyText.appendChild(document.createTextNode("Reply"));
              reply.appendChild(replyText);
                var replySvg = document.createElementNS("http://www.w3.org/2000/svg","svg");
                replySvg.classList.add("reply");
                replySvg.setAttribute("xmlns","http://www.w3.org/2000/svg");
                replySvg.setAttribute("viewBox","0 0 65 72");
                  var replySvgPath = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                  replySvgPath.setAttribute("d","M41 31h-9V19c0-1.14-.647-2.183-1.668-2.688-1.022-.507-2.243-.39-3.15.302l-21 16C5.438 33.18 5 34.064 5 35s.437 1.82 1.182 2.387l21 16c.533.405 1.174.613 1.82.613.453 0 .908-.103 1.33-.312C31.354 53.183 32 52.14 32 51V39h9c5.514 0 10 4.486 10 10 0 2.21 1.79 4 4 4s4-1.79 4-4c0-9.925-8.075-18-18-18z");
                replySvg.appendChild(replySvgPath);
              reply.appendChild(replySvg);
            actions.appendChild(reply);

              var retweet = document.createElement("a");
              retweet.setAttribute("target", "_blank");
              retweet.setAttribute("href", "https://twitter.com/intent/retweet?tweet_id=" + tweet.id_str);
                var retweetText = document.createElement("span");
                retweetText.classList.add("hidden")
                retweetText.appendChild(document.createTextNode("Retweet"));
              retweet.appendChild(retweetText);
                var retweetSvg = document.createElementNS("http://www.w3.org/2000/svg","svg");
                retweetSvg.classList.add("retweet");
                retweetSvg.setAttribute("xmlns","http://www.w3.org/2000/svg");
                retweetSvg.setAttribute("viewBox","0 0 75 72");
                  var retweetSvgPath = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                  retweetSvgPath.setAttribute("d","M70.676 36.644C70.166 35.636 69.13 35 68 35h-7V19c0-2.21-1.79-4-4-4H34c-2.21 0-4 1.79-4 4s1.79 4 4 4h18c.552 0 .998.446 1 .998V35h-7c-1.13 0-2.165.636-2.676 1.644-.51 1.01-.412 2.22.257 3.13l11 15C55.148 55.545 56.046 56 57 56s1.855-.455 2.42-1.226l11-15c.668-.912.767-2.122.256-3.13zM40 48H22c-.54 0-.97-.427-.992-.96L21 36h7c1.13 0 2.166-.636 2.677-1.644.51-1.01.412-2.22-.257-3.13l-11-15C18.854 15.455 17.956 15 17 15s-1.854.455-2.42 1.226l-11 15c-.667.912-.767 2.122-.255 3.13C3.835 35.365 4.87 36 6 36h7l.012 16.003c.002 2.208 1.792 3.997 4 3.997h22.99c2.208 0 4-1.79 4-4s-1.792-4-4-4z");
                retweetSvg.appendChild(retweetSvgPath);
              retweet.appendChild(retweetSvg);
            actions.appendChild(retweet);

              var like = document.createElement("a");
              like.setAttribute("target", "_blank");
              like.setAttribute("href", "https://twitter.com/intent/like?tweet_id=" + tweet.id_str);
                var likeText = document.createElement("span");
                likeText.classList.add("hidden")
                likeText.appendChild(document.createTextNode("Link"));
              like.appendChild(likeText);
                var likeSvg = document.createElementNS("http://www.w3.org/2000/svg","svg");
                likeSvg.classList.add("like");
                likeSvg.setAttribute("xmlns","http://www.w3.org/2000/svg");
                likeSvg.setAttribute("viewBox","0 0 54 72");
                  var likeSvgPath = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                  likeSvgPath.setAttribute("d","M38.723,12c-7.187,0-11.16,7.306-11.723,8.131C26.437,19.306,22.504,12,15.277,12C8.791,12,3.533,18.163,3.533,24.647 C3.533,39.964,21.891,55.907,27,56c5.109-0.093,23.467-16.036,23.467-31.353C50.467,18.163,45.209,12,38.723,12z");
                likeSvg.appendChild(likeSvgPath);
              like.appendChild(likeSvg);
            actions.appendChild(like);

          newTweet.appendChild(actions);

          tweetsSectionOnPage.insertBefore(newTweet, tweetsSectionOnPage.firstChild);
        }

      }
    }
  };
  xhttp.open("GET", "https://assets.allsaints.church/allsaintshoole-tweets.json", true);
  xhttp.send();
}