const focused = [];
function selectRandom(){
    clearSelection();
    const rand = Math.floor(Math.random() * (74)) + 1
    const chosen = document.getElementById("tr" + rand)
    focused.push(chosen);
    chosen.classList.add("focus")
    chosen.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function clearSelection(){
    for(element of focused){
        element.classList.remove("focus");
    }
}