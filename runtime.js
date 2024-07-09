var focused = null;
onButton = false;

document.addEventListener('mousedown', click);

function toggleOnButton(){
    if(onButton){
        onButton = false;
    }else{
        onButton = true;
    }
}

function click(){
    if(!onButton){
        clear();
    }
}

function random(){
    clear();
    const rand = Math.floor(Math.random() * (getMaxTr())) + 1
    focused = document.getElementById("tr" + rand)
    focused.classList.add("focus")
    focused.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function clear(){
    if(focused != null){
        focused.classList.remove("focus");
        focused = null;
    }
}