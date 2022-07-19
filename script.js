let overallData = {
    'rows' : 18,
    'cols' : 46,
    'icon_selected': [],
    'start_selected': false,
    'end_selected': false,
    'ufo_html': '<img class="icons icon-inside-1 ufo" src="images/ufo.png" alt="ufo-image"></img>',
    'alien_html':'<img class="icons icon-inside-2 alien" src="images/monster.png" alt="image-alien">',
    'isAlgoSelected': false,
    'algo':'',
    'gridStart': [],
    'gridEnd': [],
};

const reset = function(algo){
    overallData.icon_selected = [];
    overallData.start_selected =  false;
    overallData.end_selected =  false;
    overallData.gridStart = [];
    overallData.gridEnd = [];
    overallData.isAlgoSelected = false,
    overallData.algo = algo;
    overallData.intervalsClose = false;


    clearTimeouts();
    createGrid();
    allowDrag();
    changeAlgoInfo(algo)
}

const ufo_html = function(gridVal){

    if(overallData.start_selected) return ''; 
    
    overallData.gridStart = gridVal.split(',').map(val=>Number.parseInt(val));
    
    overallData.icon_selected = [];
    overallData.start_selected = true;
    
    return overallData.ufo_html;
}

const alien_html = function(gridVal){
    
    if(overallData.end_selected) return '';
    
    overallData.gridEnd = gridVal.split(',').map(val=> Number.parseInt(val));
    overallData.end_selected = true;
    overallData.icon_selected = [];
    
    return overallData.alien_html;

};


//create grid
const createGrid = function(){
    const grid = document.querySelector(".Grid");
    grid.innerHTML = '';

    for(let i =0;i<overallData.rows;i++){
        for(let j = 0;j<overallData.cols;j++)
            grid.insertAdjacentHTML('beforeend',`<div class="box" grid_val = ${i},${j}></div>`);
    
    }
}



//Drag and drop
// select the item element
const icons = Array.from(document.querySelectorAll('.icons'));
// attach the dragstart event handler
icons.forEach(function(icon){
    icon.addEventListener('dragstart', function(){

        if(!overallData.start_selected || !overallData.end_selected)
            overallData.icon_selected = Array.from(icon.classList);

    });
});



//Adding event listner on Grid
const allowDrag = function(){

    let boxes = Array.from(document.querySelectorAll(".box"));
    boxes.forEach(function(box){
    
        box.addEventListener('dragenter', dragEnter)
        box.addEventListener('dragover', dragOver);
        box.addEventListener('dragleave', dragLeave);
        box.addEventListener('drop', drop);
    
    });
    


    function dragEnter(event) {
        event.target.classList.add("dragover");
    }
    
    function dragOver(event) {
        event.preventDefault();
        event.target.classList.add("dragover");
    
        // console.log(event.target.getAttribute("grid_val"));
    }
    
    function dragLeave(event) {
        event.preventDefault();
        event.target.classList.remove("dragover");
    }

    function drop(event) {
        event.target.classList.remove("dragover");
    
        // The DataTransfer.getData() method retrieves drag data (as a string) for the specified type. If the drag operation does not include data, this method returns an empty string.
        //data types are 'text/plain'
    
        
        //here drag data is a ufo png image so drag_data contains 
        //http://127.0.0.1:5500/images/ufo.png
        // const drag_data = event.dataTransfer.getData('text/plain');
        
        if(overallData.icon_selected[0]){
    
            const gridVal = event.target.getAttribute('grid_val');
            const html = overallData.icon_selected.includes('ufo') ? ufo_html(gridVal) : alien_html(gridVal); 
            
                
            event.target.insertAdjacentHTML('afterBegin',html);
                
        }
    }
}


//contact me
icons.forEach(function(icon){

    icon.addEventListener('click',function(){

            if(this.classList.contains('linkedin')){
                window.location.href ="www.linkedin.com/in/ritik-thapliyal-n3w";
            }

            else if(this.classList.contains('github')){
                window.location.href = "https://github.com/ritikthapliyal";
            }
});});



//event listners to BUTTONS
const buttons = Array.from(document.querySelectorAll('.btn'));
buttons.forEach(function(btn){

    btn.addEventListener('click',function(){

        if(this.getAttribute('value') === 'reset')reset(overallData.algo);
        else{

            if(overallData.start_selected && overallData.end_selected){
                if(overallData.algo === 'BFS') startBFS();
                else startDFS();

            }}});});



// Adding event listners.
const navElements = Array.from(document.querySelectorAll(".nav-ele"));
const dropdowns = Array.from(document.querySelectorAll(".dropdown"));
const liElements = Array.from(document.querySelectorAll('.algorithm-name'));

navElements.forEach(function(navele){
    navele.addEventListener('click',function(event){
        event.preventDefault();   

        // if(isDropdownOpen) closeDropdowns;
        navele.classList.toggle('clicked');
        this.children[2].classList.toggle('hidden');
        isDropdownOpen = true;
    }
)});

liElements.forEach(function(li){
    li.addEventListener('click',function(){
        
        let selectedAlgo = li.textContent;

        if(selectedAlgo.includes('BFS')) selectedAlgo = 'BFS';
        else selectedAlgo = 'DFS';

        if(overallData.algo !== selectedAlgo) changeAlgo(selectedAlgo);
    });
});

const changeAlgo = function(algo){

    const Grid = document.querySelector(".Grid");
    const loading = document.querySelector(".section-loading")
    
    Grid.classList.add('hidden');
    loading.classList.add('loading');
    clearTimeouts();

    setTimeout(function(){
        reset(algo);
        createGrid();
        allowDrag();
        changeAlgoInfo(algo);
        overallData.algo = algo;
        overallData.isAlgoSelected = true;
        Grid.classList.remove('hidden');
        loading.classList.remove('loading');
    },3000);

    
}

const clearTimeouts = function(){ 
        let id = window.setTimeout(function() {}, 0);
        while (id--) window.clearTimeout(id);}

//IF CLICKED OUTSIDE OF THE DROPDOWN
document.addEventListener('click',function(event){

    if(!document.querySelector('.nav-algorithms').contains(event.target)){
        dropdowns.forEach(function(dropdown){
            dropdown.classList.add('hidden');
        });
    }

});
     
    

//CHANGE ALGO INFO
const changeAlgoInfo = function(name){

    const about = document.querySelectorAll('.about--');
    about[0].textContent = 'About';
    about[1].textContent = 'Algorithm';
    
    
    const algorithm = document.querySelector('.algorithm--');

    if(name === 'BFS') {algorithm.textContent = 'Breadth First Search'; 
    //  = 'Breadth first search';
    console.log(navElements[0]);
    }
    else algorithm.textContent = 'Depth First Search';

};



//BFS Alogorithm
const startBFS = function(){

    const rows = overallData.rows;
    const cols = overallData.cols;

    let [x2,y2] = overallData.gridEnd;

    // Array methods used:
    //.shift(): removes the first element.  It also returns the removed element.
    //.push():
    //document.querySelectorAll('[data-foo="value"]');


    let visited = Array.from({length:rows}, function(){

        return Array.from({length:cols}, function(){return -1;});

    });
        
    found = false;
    let distance = 0;
    let returnPath = [];
    const directions = [ [0,1] , [0,-1], [-1,0], [1,0]]; 
    const inGrid = function(x,y){
        if(x >= 0 && y >= 0 && x < rows && y < cols) return true;
        else return false;
    }
    let queue = [];
    queue.push(overallData.gridStart);
    visited[overallData.gridStart[0]][overallData.gridStart[1]] = 0;
    
    let forTimer = 30;
    while(1){

        const [x1,y1] = queue.shift();

        //gather possible neighbours;
        for(let i =0;i<4;i++){
            const x_ = directions[i][0] + x1;
            const y_ = directions[i][1] + y1;

            if(x_ === x2 && y_=== y2){
                found = true;
                break;
            }

            if(inGrid(x_,y_) && visited[x_][y_] === -1){
                

                queue.push([x_,y_]);
                distance++;
                visited[x_][y_] = distance;


                setTimeout(function(){
                    document.querySelector(`[grid_val="${x_},${y_}"]`).style.backgroundColor = "#eaf216"  
                },forTimer*17.8);
                
                setTimeout(function(){

                    document.querySelector(`[grid_val="${x_},${y_}"]`).style.backgroundColor = "#fff";

                    document.querySelector(`[grid_val="${x_},${y_}"]`).classList.add('about-to-visit');  
                
                },forTimer*18.04);
            }

        }

        forTimer++;

        if(found){
            //Way back through the grids visited. 
            while( !(x2 === overallData.gridStart[0] && y2 === overallData.gridStart[1])){
    
                let min_val = 10000;
                let min_coordinates = [];
                for(let i = 0;i<4;i++){
            
                    const x_ = directions[i][0] + x2;
                    const y_ = directions[i][1] + y2;
            
                    if(inGrid(x_,y_) &&  visited[x_][y_] >= 0 && visited[x_][y_] < min_val){
                        min_val = visited[x_][y_];
                        min_coordinates = [x_,y_];
                    }
            
                }
            
                x2 = min_coordinates[0];
                y2 = min_coordinates[1];
            
                returnPath.push(min_coordinates);
            }

            forTimer/=2;
            for(let i=returnPath.length-2;i>=0;i--){
            forTimer++;
            setTimeout(function(){
                
                document.querySelector(`[grid_val="${returnPath[i][0]},${returnPath[i][1]}"]`).classList.remove('about-to-visit');
                
                document.querySelector(`[grid_val="${returnPath[i][0]},${returnPath[i][1]}"]`).classList.add('path');
                },35*forTimer);    
            }
            
            break;
        }
    }
    
}

//DFS
const startDFS = function(){

    const rows = overallData.rows;
    const cols = overallData.cols;

    let [x2,y2] = overallData.gridEnd;

    let visited = Array.from({length:rows}, function(){
        return Array.from({length:cols}, function(){return 0;});
    });
        
    found = false;
    let returnPath = [];
    const directions = [[-1,0],[0,-1],[1,0],[0,1]]; 
    const inGrid = function(x,y){
        if(x >= 0 && y >= 0 && x < rows && y < cols) return true;
        else return false;
    }
    let stack = [];
    stack.push(overallData.gridStart);
    visited[overallData.gridStart[0]][overallData.gridStart[1]] = 0;

    let forTimer = 0;
    while(stack.length) {

        const [x1,y1] = stack.pop();

        if(x1 === x2 && y1=== y2) break;

        if(forTimer){
        
        setTimeout(function(){
            document.querySelector(`[grid_val="${x1},${y1}"]`).style.backgroundColor = "#eaf216"
            
            },forTimer*20);
    
        setTimeout(function(){
            document.querySelector(`[grid_val="${x1},${y1}"]`).style.backgroundColor = "#fff";
            document.querySelector(`[grid_val="${x1},${y1}"]`).classList.add('about-to-visit');

            },forTimer*20.06);
        }

        visited[x1][y1] = 1;
        returnPath.push([x1,y1]);

        for(let i =0;i<4;i++){
            const x_ = directions[i][0] + x1;
            const y_ = directions[i][1] + y1;
        
            if(inGrid(x_,y_) && !visited[x_][y_]) stack.push([x_,y_]); 
        }

        forTimer++;
    }


    forTimer/=2;
    for(let i=1;i<returnPath.length;i++){
    forTimer++;
    setTimeout(function(){
        document.querySelector(`[grid_val="${returnPath[i][0]},${returnPath[i][1]}"]`).classList.remove('about-to-visit');
            
        document.querySelector(`[grid_val="${returnPath[i][0]},${returnPath[i][1]}"]`).classList.add('path');
        },40*forTimer);    
    }
} 



