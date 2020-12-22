export default class Info{
    constructor(title, text){
        this.title =  title;
        this.text = text;

        this.show = this.show.bind(this);

        this.show();
    }


    show(){
        //set up info view
        const infoSectionContainerElement = document.getElementById('info-sidebar');
        const topBarConatinerElement = document.createElement('div');
        topBarConatinerElement.setAttribute('class', 'top-bar-container');
        const titleElement = document.createElement('h1');
        titleElement.setAttribute('class', 'info-title')
        titleElement.innerHTML = this.title;
        const closeElement = document.createElement('span');
        closeElement.setAttribute('class', 'info-close');
        closeElement.innerHTML = 'X';
        topBarConatinerElement.appendChild(titleElement);
        topBarConatinerElement.appendChild(closeElement);
        const bodyElement = document.createElement('div');
        bodyElement.setAttribute('class', 'info-body');
        bodyElement.innerHTML = this.text;
        infoSectionContainerElement.appendChild(topBarConatinerElement);
        infoSectionContainerElement.appendChild(bodyElement);


        //set up listener
        closeElement.addEventListener('click', () => {
            infoSectionContainerElement.setAttribute('class', 'hidden');
        });
    }
}