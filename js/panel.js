$(function() {
  $userContent = $('.userContent');
  $clearBtn = $('#clear-button');
  $userInput = $("#user-input");

  $clearBtn.on('click', () => {$userContent.empty()})
  chrome.devtools.network.onRequestFinished.addListener(checkRequest);
});


function checkRequest(data) {
  /**
   * check the network call for the search string and highlight if matched
   * @param {} data network request object
   */

  // check if the search string is valid
  let inputText = $userInput.val();

	if (inputText != "" && inputText != null) {
		if ([200, 201, 304].includes(data.response.status)) {
			data.getContent(function (content, encoding) {
        let inputText = $userInput.val();
				
        // search the request in addition to the response
        let strToSearch = (!!data.request && data.request.url) + content;
        if (strToSearch != undefined && strToSearch.indexOf(inputText) >= 0) {
          let networkCallName = data.request.method + " " + data.request.url;
          let $requestLogElement = $("<div>Found : " + inputText +
          "<br>In request: " + networkCallName + "<br><br></div>");
          let tr = $userContent.prepend($requestLogElement);

          // flash the network call list item if it contains the search string  
          flashElement($requestLogElement);
        }
			})
		}
	}
}

function flashElement ($el) {
  /**
   * flash an element green for 2 seconds
   * @param {jQuery} $el The element that you want to flash once
   */
  $el.addClass('greenHighlight');
}
