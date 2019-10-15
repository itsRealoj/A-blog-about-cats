'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/**
 * Sends GET requests for uid, title and content in parallel
 * Sends resulting object as POST request
 * Handles response from POST request and prints result to DOM
 */
var createPost = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var uidPromise, titlePromise, contentPromise, _ref2, _ref3, uidResponse, titleResponse, contentResponse, postPromise, post;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // create three request Promises (starts sending requests)
            uidPromise = makeRequest('GET', 'https://us-central1-open-classrooms-js-for-the-web.cloudfunctions.net/widgets/generate-uid');
            titlePromise = makeRequest('GET', 'https://us-central1-open-classrooms-js-for-the-web.cloudfunctions.net/widgets/generate-title');
            contentPromise = makeRequest('GET', 'https://us-central1-open-classrooms-js-for-the-web.cloudfunctions.net/widgets/generate-lorem');

            // await responses from three requests and assign to three constants

            _context.next = 5;
            return Promise.all([uidPromise, titlePromise, contentPromise]);

          case 5:
            _ref2 = _context.sent;
            _ref3 = _slicedToArray(_ref2, 3);
            uidResponse = _ref3[0];
            titleResponse = _ref3[1];
            contentResponse = _ref3[2];


            // concatenate data from GET requests and make POST request
            postPromise = makeRequest('POST', 'https://us-central1-open-classrooms-js-for-the-web.cloudfunctions.net/widgets/create-post-with-uid', { uid: uidResponse.uid, title: titleResponse.title, content: contentResponse.lorem });

            // assign result to constant and print constant properties to DOM

            _context.next = 13;
            return postPromise;

          case 13:
            post = _context.sent;

            postTitle.textContent = post.post.title;
            postId.textContent = post.post.id;
            postContent.textContent = post.post.content;

          case 17:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function createPost() {
    return _ref.apply(this, arguments);
  };
}();

// click listener for Generate Post! button


function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// Get DOM elements
var generateButton = document.getElementById('generate-button');
var postTitle = document.getElementById('post-title');
var postId = document.getElementById('post-id');
var postContent = document.getElementById('post-content');

/**
 * Makes an AJAX request of type 'verb' to 'url' with optional 'data' object
 * Returns a Promise which resolves or rejects with server response
 */
function makeRequest(verb, url, data) {
  return new Promise(function (resolve, reject) {

    // create and open AJAX request
    var request = new XMLHttpRequest();
    request.open(verb, url);

    request.onreadystatechange = function () {
      // only execute code if request is ready
      if (request.readyState === 4) {
        // request is successful for codes 200 or 201  
        if (request.status === 200 || request.status === 201) {
          resolve(JSON.parse(request.response));
        } else {
          reject(JSON.parse(request.response));
        }
      }
    };
    // for POST requests, set Content-Type header and send request with 'data` object
    // otherwise, simply send request
    if (verb === 'POST') {
      request.setRequestHeader('Content-Type', 'application/json');
      request.send(JSON.stringify(data));
    } else {
      request.send();
    }
  });
}generateButton.addEventListener('click', function () {
  createPost();
});
