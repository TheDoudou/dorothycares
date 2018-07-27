/*
----------------------------------------------------------------------
Dialogflow conversation
----------------------------------------------------------------------
*/

/**
 * @function toggleAnswerModal
 * @param {*} modal 
 * @param {boolean} show true affiche, false cache la fenêtre modal
 * @description fonction qui affiche ou cache la fenêtre Modal.
 */
function toggleAnswerModal(modal,show = true) {

  if (show) {
    modal.style.right = "-20px";
    hidingBgDiv.style.display = "block";
    terminal.setAttribute('data-visibility','false');
  } else {
    modal.style.right = "-120%";
    hidingBgDiv.style.display = "none";
    terminal.setAttribute('data-visibility','true');
  }

}

/**
 * @function createLink
 * @param {string} link url du lien
 * @param {boolean} displayText 
 * @param {string} title title de la balise
 * @param {string} target target de la balise
 * @returns {string} retourne la balise <a>
 * @description crée une balise <a>
 */
function createLink(link, displayText = false, title = '', target = "_blank") {
  if (!displayText) { // if no displayText
    return '<a href="' + link + '" rel="external" target="' + target + '" title="' + title + '">' + link + '</a>';
  } else {
    return '<a href="' + link + '" rel="external" target="' + target + '" title="' + title + '">' + displayText + '</a>';
  }
}

/**
 * @function isJsonString
 * @param {string} str objet JSON en format texte
 * @returns {boolean} true le texte est un objet JSON, false le texte n'est pas un objet JSON
 * @description vérifie si le string est au format JSON
 */
function isJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

/**
 * @function formatTextFromDorothy
 * @param {string} str
 * @description Rend le lien cliquable et ajoute une nouvelle ligne avec <br/>
 * @see voir la méthode anchorme dans le fichier anchorme.js
 */
function formatTextFromDorothy (str) {
  /* Make link clickable and transform new line to <br> */
  let options = {
      attributes: [{
        name: "target",
        value: "_blank"
      }],
      files: false,
      ips: false
    }
  return anchorme(nl2br(str), options);
}

/**
 * @function escapeHtml
 * @param {string} text le texte qui doit être nettoyer
 * @returns {string} retourne le texte nettoyer
 * @description remplace certain caractère html en caractère d'échappement (ex: & est remplacer par &amp)
 */
function escapeHtml(text) {
  return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
}

/**
 * @function addDorothyAnswerText
 * @param {string} answer le texte de la réponse à afficher dans le terminal
 * @param {string} selector selecteur css des balises cibles.
 * @param {boolean} error true : une erreur c'est produite, false, la requête à réussie
 * @description crée une nouvelle balise et y ajoute la réponse de Dorothy 
 */
function addDorothyAnswerText(answer, selector, error = false) {
  // (IN) [string] answer : text of the answer to display in terminal
  // (IN) [string] selector : selector to target where to write
  // (IN) [boolean] error : if it's an error and an succesfull request
  // (OUT) -

  let elements = document.querySelectorAll(selector);
  let div = document.createElement('div');
  div.classList.add('answer');
  elements[elements.length - 1].appendChild(div);

  if (!error) { // if no error

    div.innerHTML = answer;
    //console.log(document.querySelectorAll(selector));
    //console.log(answer);

  } else { // if error

    let errorText = [
      'Sorry. There is a bug in my brain. Please try again!',
      'OMG! My digital brain has some disturbances.',
      'Oops, I did it again. There is a new bug.',
      'Please don\'t be sad but I\'ve some difficulties to answer you.'
    ]
    div.innerText = errorText[ Math.floor(Math.random() * errorText.length) ];

    console.log('*** /!\ There is an error /!\ ***');
    console.log(answer);
    console.log('*** *** *** *** ***');

  }

}

/**
 * @function addNewUserRequest
 * @param {*string} selector selecteur css des balises cibles.
 * @description crée une nouvelle balise pour une nouvelle requête de l'utilisateur.
 */
function addNewUserRequest(selector) {

  let elements = document.querySelectorAll(selector);
  let elementsParent = elements[elements.length - 1].parentNode;
  let div = document.createElement('div');
  div.classList.add('instruction');
  elementsParent.appendChild(div);
  div.innerHTML = '<div class="user-request"><span class="terminal-control"><div class="user-input"></div><span class="terminal-symbol">_</span></span></div>';
  window.scrollTo(0, document.body.scrollHeight);
  document.querySelector('.user-input').setAttribute('contentEditable', true);
  document.querySelector('.terminal-symbol').addEventListener('click', function () {
    document.querySelector('.user-input').focus();
  });

}

/**
 * @function writeRessourcesInfoModal
 * @param {*} dataObject objet JSON reçus de dialogflow
 * @param {*} contentBody balise cible.
 * @description crée la fenêtre Modal, ajoute les info de l'objet "dataObject" et le place dans contentBody (ex: php)
 */
function writeRessourcesInfoModal(dataObject, contentBody) {

  let content = '';

  // <h1> Title
  content += '<h1 class="modal-body-title">' + dataObject.displayName + '</h1>';

  // Intro section
  content += '<div class="modal-body-block">';
  content += '<h3 class="modal-body-block-title">What is ' + dataObject.displayName + '?</h3>';
  content += '<div class="modal-body-block-content">' + dataObject.intro + '</div>';
  content += '</div>';

  if (dataObject.installation.length > 0) {
    content += '<div class="modal-body-block installation">';
    content += '<h3 class="modal-body-block-title">Installation</h3>';
    content += '<div class="modal-body-block-content">';
    content += '<ul class="modal-body-block-list">';
    if (dataObject.installation[0].official != '') {
      content += '<li class="modal-body-block-list-item"><span>Official:</span> ' + createLink(dataObject.installation[0].official) + '</li>';
    }
    if (dataObject.installation[0].Windows != '') {
      content += '<li class="modal-body-block-list-item"><span>Windows:</span> ' + createLink(dataObject.installation[0].Windows) + '</li>';
    }
    if (dataObject.installation[0].Mac != '') {
      content += '<li class="modal-body-block-list-item"><span>Mac:</span> ' + createLink(dataObject.installation[0].Mac) + '</li>';
    }
    if (dataObject.installation[0].Ubuntu != '') {
      content += '<li class="modal-body-block-list-item"><span>Ubuntu:</span> ' + createLink(dataObject.installation[0].Ubuntu) + '</li>';
    }
    if (dataObject.installation[0].other != '') {
      content += '<li class="modal-body-block-list-item"><span>Other:</span> ' + createLink(dataObject.installation[0].other) + '</li>';
    }
    content += '</ul>';
    content += '</div>';
    content += '</div>';
  }

  if (dataObject.documentation.length > 0) {
    content += '<div class="modal-body-block documentation">';
    content += '<h3 class="modal-body-block-title">Documentation</h3>';
    content += '<div class="modal-body-block-content">';
    content += '<ul class="modal-body-block-list">';
    if (dataObject.documentation[0].official != '') {
      content += '<li class="modal-body-block-list-item"><span>Official:</span> ' + createLink(dataObject.documentation[0].official) + '</li>';
    }
    if (dataObject.documentation[0].useful != '') {
      content += '<li class="modal-body-block-list-item"><span>Useful:</span> ' + createLink(dataObject.documentation[0].useful) + '</li>';
    }
    if (dataObject.documentation[0].getstarted != '') {
      content += '<li class="modal-body-block-list-item"><span>Get started:</span> ' + createLink(dataObject.documentation[0].getstarted) + '</li>';
    }
    content += '</ul>';
    content += '</div>';
    content += '</div>';
  }

  if (dataObject.tutorials.length > 0) {
    content += '<div class="modal-body-block tutorials">';
    content += '<h3 class="modal-body-block-title">Tutorials</h3>';
    content += '<div class="modal-body-block-content">';
    content += '<ul class="modal-body-block-list">';
    dataObject.tutorials.forEach( (item) => {
      content += '<li class="modal-body-block-list-item">' + createLink(item.url,item.name) + ': ';
      content += item.description;
      content += '</li>';
    });
    content += '</ul>';
    content += '</div>';
    content += '</div>';
  }

  if (dataObject.exercices.length > 0) {
    content += '<div class="modal-body-block exercices">';
    content += '<h3 class="modal-body-block-title">Exercices</h3>';
    content += '<div class="modal-body-block-content">';
    content += '<ul class="modal-body-block-list">';
    dataObject.exercices.forEach( (item) => {
      if (item.name !== 'undefined') {
        content += '<li class="modal-body-block-list-item">' + createLink(item.url,item.name) + '</li>';
      } else {
        content += '<li class="modal-body-block-list-item">' + createLink(item.url) + '</li>';
      }
    });
    content += '</ul>';
    content += '</div>';
    content += '</div>';
  }

  if (dataObject.examples.length > 0) {
    content += '<div class="modal-body-block examples">';
    content += '<h3 class="modal-body-block-title">Examples</h3>';
    content += '<div class="modal-body-block-content">';
    content += '<ul class="modal-body-block-list">';
    dataObject.examples.forEach( (item) => {
      content += '<li class="modal-body-block-list-item">' + item.exampleName + ': ';
      if (typeof item.exampleDemo != 'undefined' && item.exampleDemo != 'false' && item.exampleDemo.length != '') {
        content += createLink(item.exampleDemo,'Demo');
        content += ' ';
      }
      if (typeof item.exampleRepo != 'undefined' && item.exampleRepo != 'false' && item.exampleRepo.length != '') {
        content += createLink(item.exampleRepo,'Repository');
      }
      content += '</li>';
    });
    content += '</ul>';
    content += '</div>';
    content += '</div>';
  }

  if (dataObject.news.length > 0) {
    content += '<div class="modal-body-block news">';
    content += '<h3 class="modal-body-block-title">News</h3>';
    content += '<div class="modal-body-block-content">';
    content += '<ul class="modal-body-block-list">';
    dataObject.news.forEach( (item) => {
      if (item.name !== 'undefined') {
        content += '<li class="modal-body-block-list-item">' + createLink(item.url,item.name) + '</li>';
      } else {
        content += '<li class="modal-body-block-list-item">' + createLink(item.url) + '</li>';
      }
    });
    content += '</ul>';
    content += '</div>';
    content += '</div>';
  }

  contentBody.innerHTML = content;

}

/**
 * @function writeToolboxInfoModal
 * @param {*} dataObject objet JSON reçus de dialogflow
 * @param {*} contentBody balise cible
 * @description crée la fenêtre Modal, ajoute les info de l'objet "dataObject" et le place dans contentBody
 */
function writeToolboxInfoModal(dataObject, contentBody) {

  let content = '';

  // <h1> Title
  content += '<h1 class="modal-body-title">' + dataObject.displayName + '</h1>';

  // Intro section
  if (typeof dataObject.desc !== 'undefined') {
    content += '<div class="modal-body-block">';
    content += '<h3 class="modal-body-block-title">More information</h3>';
    content += '<div class="modal-body-block-content">' + dataObject.desc + '</div>';
    content += '</div>';
  }

  if (dataObject.tools.length > 0) {
    content += '<div class="modal-body-block tools">';
    content += '<h3 class="modal-body-block-title">Tools</h3>';
    content += '<div class="modal-body-block-content">';
    content += '<ul class="modal-body-block-list">';
    dataObject.tools.forEach( (item) => {
      content += '<li class="modal-body-block-list-item">' + createLink(item.url,item.name) + '</li>';
    });
    content += '</ul>';
    content += '</div>';
    content += '</div>';
  }

  if (dataObject.usecase.length > 0) {
    content += '<div class="modal-body-block usecase">';
    content += '<h3 class="modal-body-block-title">Usecases</h3>';
    content += '<div class="modal-body-block-content">';
    content += '<ul class="modal-body-block-list">';
    dataObject.usecase.forEach( (item) => {
      content += '<li class="modal-body-block-list-item">' + createLink(item.url,item.name) + '</li>';
    });
    content += '</ul>';
    content += '</div>';
    content += '</div>';
  }

  contentBody.innerHTML = content;

}

/**
 * @function writeStartupMembersInfoModal
 * @param {*} dataObject objet JSON reçus par dialogflow
 * @param {*} contentBody balise cible
 * @description crée une fenêtre Modal, ajoute les info de l'objet "dataObject" concernant le membre et le place dans contentBody
 */
function writeStartupMembersInfoModal(dataObject, contentBody) {

  let content = '';

  // <h1> Title
  content += '<h1 class="modal-body-title">Startup members</h1>';

  if (dataObject.response.length > 0) {
    content += '<div class="modal-body-block member-list">';
    content += '<h3 class="modal-body-block-title">List</h3>';
    content += '<div class="modal-body-block-content">';
    content += '<table class="modal-body-block-table">';
    dataObject.response.forEach( (item) => {
      content += '<tr class="modal-body-block-row">';
      if (item.firstName !== null) {
        content += '<td class="modal-body-block-cell">' + item.firstName + '<td>';
      } else {
        content += '<td class="modal-body-block-cell empty"> - <td>';
      }
      if (item.lastName !== null) {
        content += '<td class="modal-body-block-cell">' + item.lastName + '<td>';
      } else {
        content += '<td class="modal-body-block-cell empty"> - <td>';
      }
      content += '<td class="modal-body-block-cell">' + formatTextFromDorothy(item.email) + '<td>';
      content += '</tr>';
    });
    content += '</table>';
    content += '</div>';
    content += '</div>';
  } else {
   content += '<div class="modal-body-block tools">';
   content += '<div class="modal-body-block-content">';
   content += 'Sorry. There is nobody in this startup for the moment.';
   content += '</div>';
   content += '</div>';
  }

  contentBody.innerHTML = content;

}
/**
 * @description nombres de requêtes (cf: launchDialogFlowConversation)
 */
let NumberRequest = {
  //number of request
  total: 0,
  dorothy: 0,
  dialogflow: 0,
  succed: 0,
  failed: 0,
  ressources: 0,
  toolbox: 0,
  text: 0,
  list: 0,
  //other
  date:"",            //todo
  maxRequest:15000,   //todo

  serialize: ()=>{

  },
  deserialize: ()=>{

  }
}

/**
 * @function launchDialogFlowConversation
 * @param {*} e 
 * @param {string} accessToken 
 * @param {string} baseUrl 
 * @param {string} version 
 * @param {string} emailUser 
 * @param {*} tokenUser 
 * @param {*} sessionId 
 * @description fonction PRINCIPAL qui reçoit la réponse de DialogFlow et la traite
 */
function launchDialogFlowConversation (e,accessToken,baseUrl,version,emailUser,tokenUser,sessionId) {

  document.querySelector('.user-input').focus();
  userInstruction = document.querySelector('.user-input').textContent; // we save the current value

  const axiosInstance = axios.create({
    baseURL: baseUrl + 'query?v=' + version,
    timeout: 10000, // 10 sec
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': 'Bearer ' + accessToken
    },
    maxContentLength: 1000000, // 1Mo
  });

  if (e.key == 'Enter' && userInstruction != '') {
      e.preventDefault();
      //number total request DialogFlow
      NumberRequest.total++;
      document.querySelector('.user-input').setAttribute('contentEditable', false);
      document.querySelector('.terminal-control').parentNode.removeChild(document.querySelector('.terminal-control'));

      let span = document.createElement("span");
      span.classList.add("request");
      document.querySelectorAll('.user-request')[document.querySelectorAll('.user-request').length - 1].appendChild(span);
      span.innerText = userInstruction;

      axiosInstance.post(baseUrl + 'query?v=' + version, {
        query: userInstruction,
        lang: "en",
        emailUser: emailUser,
        tokenUser: tokenUser,
        sessionId: sessionId
      })
        .then(function (response) { // if request succeeded
          //number request of successes
          NumberRequest.succed++;

          //console.log(response);
          // we store the session for the context following
          if (typeof response.data.sessionId !== 'undefined') {
            sessionId = response.data.sessionId;
          }

          // we store the answer of Dorothy agent
          let dorothyAnswerText = response.data.result.fulfillment.speech;

          // nombre de requete inferieur au nombre maximum autorisé.
          // we text if the answer is a JSON
          if (NumberRequest.total < NumberRequest.maxRequest && isJsonString(dorothyAnswerText) ) {
            //number request from DialogFlow
            NumberRequest.dialogflow++;

            // we parse the JSON
            dorothyAnswerObject = JSON.parse(dorothyAnswerText);

            if (dorothyAnswerObject.api === 'no-rel') {

              if (dorothyAnswerObject.type === 'ressources') {
                //number request of ressources
                NumberRequest.ressources++;

                if (dorothyAnswerObject.modal === true) {

                  dorothyAnswerText = 'Check in the modal for the requested information. Hope that\'s will help you.';
                  answerModalBody.innerHTML = '';
                  toggleAnswerModal(answerModal,true);
                  writeRessourcesInfoModal(dorothyAnswerObject.ressources, answerModalBody);

                }
              } else if (dorothyAnswerObject.type === 'toolbox') {
                //nuber request of toolbox
                NumberRequest.toolbox++;

                if (dorothyAnswerObject.modal === true) {

                  dorothyAnswerText = 'Check in the modal for the requested information. Hope that\'s will help you.';
                  answerModalBody.innerHTML = '';
                  toggleAnswerModal(answerModal,true);
                  //console.log(dorothyAnswerObject.toolbox);
                  writeToolboxInfoModal(dorothyAnswerObject.toolbox, answerModalBody);

                }

              }

            } else if (dorothyAnswerObject.api === 'rel') {

              if (dorothyAnswerObject.type === 'text') {
                //number request is text
                NumberRequest.text++;

                dorothyAnswerText = formatTextFromDorothy(dorothyAnswerObject.message);

              } else if (dorothyAnswerObject.type === 'list') {
                //number request list
                NumberRequest.list++;

                if (dorothyAnswerObject.modal === true) {

                  dorothyAnswerText = 'Check in the modal for the requested information. Hope that\'s will help you.';
                  answerModalBody.innerHTML = '';
                  toggleAnswerModal(answerModal,true);
                  writeStartupMembersInfoModal(dorothyAnswerObject, answerModalBody);

                }

              }

            }

            addDorothyAnswerText(dorothyAnswerText,'.user-request',false);
            addNewUserRequest('.instruction');

          } else { // if Dorothy answer a text
            //number request from dorothy
            NumberRequest.dorothy++;
            
            dorothyAnswerText = formatTextFromDorothy(response.data.result.fulfillment.messages[0].speech);
            addDorothyAnswerText(dorothyAnswerText,'.user-request',false); // we display the answer
            addNewUserRequest('.instruction'); // we create a new entry section for the user
            
          }
          
          scrollDown();
          
        })
        .catch(function (error) { // if the request failed
          
          //number request is failed
          NumberRequest.failed++;
          addDorothyAnswerText(error,'.user-request',true); // we display the answer
          addNewUserRequest('.instruction'); // we create a new entry section for the user

        });

    console.log("UserInstruction : ", NumberRequest);


  } else if (e.key == 'Enter' && userInstruction == '') {

    e.preventDefault();
    
    console.log("userInstruction empty : ", NumberRequest);
  }
}
/**
 * @event DOMContentLoaded
 * @description event qui se lance après le chargement des balises HTML. (DOM)
 * @function fonction qui initialise les variables
 */
document.addEventListener('DOMContentLoaded', function() {

    date_time('.os-bar__date-time'); // update date/time

    let userInstruction; // variable temporaire
    //const accessToken = '20070064bedf4ee7b077ef1ae9ea64c0'; // agent v1 - DorothyAngular
    const accessToken = 'c3fb78b0042f42cda2d1d28c9f682aae'; // agent v2 - DorothyCares
    const baseUrl = 'https://api.dialogflow.com/v1/';
    const version = '20170712';

    const emailUser = document.querySelector('body').getAttribute('data-email');
    const tokenUser = document.querySelector('body').getAttribute('data-token');
    let sessionId = document.querySelector('body').getAttribute('data-dialogflow-session');

    console.log(sessionId);

    document.querySelector('.user-input').setAttribute('contentEditable', true);
    document.querySelector('.user-input').focus();
    document.querySelector('.terminal-symbol').addEventListener('click', function () {
      document.querySelector('.user-input').focus();
    });

    document.addEventListener('keydown', function (e) { // we detect keyboard entry

      let terminalVisibility = terminal.getAttribute('data-visibility'); // !! to convert string into boolean with a double negation
      //console.log(terminalVisibility);

      if (terminalVisibility == 'true') {

        launchDialogFlowConversation(e,accessToken,baseUrl,version,emailUser,tokenUser,sessionId);

      }

    })

});
