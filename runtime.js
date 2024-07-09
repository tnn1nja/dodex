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
    if(focused == null){
        const rand = Math.floor(Math.random() * (getMaxTr())) + 1
        focused = document.getElementById("tr" + rand)
        focused.classList.add("focus")
        focused.scrollIntoView({ behavior: 'smooth', block: 'center' });
        document.getElementById("bimg").src = "../resources/buttons/cancel.png";
    }else{
        clear();
    }
}

function clear(){
    focused.classList.remove("focus");
    focused = null;
    document.getElementById("bimg").src = "../resources/buttons/random.png";
}