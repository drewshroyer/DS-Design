export default class Modal {
    constructor(textCallback){
        this.textCallback = textCallback;
        this.show = this.show.bind(this);
    }

    show(){
        const bodyElement = document.getElementById('body');
        const modalMainContainerElement = document.createElement('div');
        modalMainContainerElement.setAttribute('class','modal-main-container')
        const modalContainerElement = document.createElement('div');
        modalContainerElement.setAttribute('class','modal-container')
        const modalTitleConainerElement = document.createElement('div');
        modalTitleConainerElement.setAttribute('class','modal-title-container');
        const modalTitleElement = document.createElement('h1');
        modalTitleElement.innerHTML = "Add Text"
        modalTitleElement.setAttribute('class','modal-title');
        const modalCloseElement = document.createElement('span');
        modalCloseElement.innerHTML = "X"
        modalCloseElement.setAttribute('class','modal-close');
        const modalInputElement = document.createElement('input');
        modalInputElement.placeholder = "Add text here"
        modalInputElement.setAttribute('class','modal-input');
        const modalSubmitElement = document.createElement('button');
        modalSubmitElement.innerHTML = "Submit"
        modalSubmitElement.setAttribute('class','modal-submit');

        modalTitleConainerElement.appendChild(modalTitleElement);
        modalTitleConainerElement.appendChild(modalCloseElement);
        modalContainerElement.appendChild(modalTitleConainerElement);
        modalContainerElement.appendChild(modalInputElement);
        modalContainerElement.appendChild(modalSubmitElement);
        modalMainContainerElement.appendChild(modalContainerElement);
        bodyElement.appendChild(modalMainContainerElement);

        //adds listeners

        //close modal on outside click
        modalMainContainerElement.addEventListener('click', (e)=>{
            modalMainContainerElement.setAttribute('class','hiddden');
        });

        //stops modal from closing if clicked inside modal
        modalContainerElement.addEventListener('click',(e)=>{
            e.stopPropagation()
        })

        //closes modal on click
        modalCloseElement.addEventListener('click', (e)=>{
            modalMainContainerElement.setAttribute('class','hiddden');
        });

        //gets text form input on submit and sending to callback
        modalSubmitElement.addEventListener('click',(e)=>{
            const inputText = modalInputElement.value;
            this.textCallback(inputText);
            modalMainContainerElement.setAttribute('class','hiddden');
        });
    }
}