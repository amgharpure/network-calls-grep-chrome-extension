$(function() {
  $userContent = $('.userContent');
  $clearBtn = $('#clear-button');
  $userInput = $("#user-input");

  $clearBtn.on('click', () => {$userContent.empty()})
  chrome.devtools.network.onRequestFinished.addListener(checkRequest);
});


function checkRequest(data) {
  let inputText = $userInput.val();
	if (inputText != "" && inputText != null) {
		if ([200, 201, 304].includes(data.response.status)) {
			data.getContent(function (content, encoding) {
        let inputText = $userInput.val();
				let strToSearch = (!!data.request && data.request.url) + content;
        if (strToSearch != undefined && strToSearch.indexOf(inputText) >= 0) {
          let networkCallName = data.request.method + " " + data.request.url;
          let $requestLogElement = $("<div>Found : " + inputText +
          "<br>In request: " + networkCallName + "<br><br></div>");
          let tr = $userContent.prepend($requestLogElement);
          flashElement($requestLogElement);
        }
			})
		}
	}
}

function flashElement ($el) {
  $el.addClass('greenHighlight');
}
