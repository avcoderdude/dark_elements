// ==================================================
// DARK ELEMENTS MOD
// Universe-Scale Shadow Expansion
// ==================================================



// ==================================================
// SECTION 1 — TERRAIN
// ==================================================

elements.shadow_sand = {
    color: ["#1a001f","#24002b","#2e0038","#3a0047"],
    behavior: behaviors.POWDER,
    category: "dark",
    state: "solid",
    density: 1600,
    tempHigh: 150,
    stateHigh: "shadow_evap",
    tick: function(pixel) {
        for (let i of adjacentCoords) {
            let x = pixel.x+i[0], y = pixel.y+i[1];
            if (!isEmpty(x,y,true)) {
                let other = pixelMap[x][y];
                if (other.element.includes("seed") || other.element.includes("plant") || other.element.includes("grass")) {
                    deletePixel(x,y);
                }
                if (other.element === "light") changePixel(pixel,"shadow_evap");
            }
        }
    }
};

elements.shadow_dirt = {
    color: ["#1a1a1a","#222222","#2b2b2b","#333333"],
    behavior: behaviors.POWDER,
    category: "dark",
    state: "solid",
    density: 1700,
    tick: function(pixel){
        for (let i of adjacentCoords) {
            let x = pixel.x+i[0], y = pixel.y+i[1];
            if (!isEmpty(x,y,true)) {
                let other = pixelMap[x][y];
                if (other.element.includes("seed") || other.element.includes("plant") || other.element.includes("grass")) {
                    deletePixel(x,y);
                }
                if (other.element === "light") changePixel(pixel,"shadow_evap");
            }
        }
        if (pixel.temp > 120 && Math.random()<0.5) {
            let nx = pixel.x + (Math.random()<0.5?-1:1);
            let ny = pixel.y + (Math.random()<0.5?-1:1);
            if (isEmpty(nx,ny)) movePixel(pixel,nx,ny);
        }
    }
};

elements.shadow_evap = {
    color:["#4b0082","#6a00ff","#9d00ff"],
    behavior: behaviors.GAS,
    category:"dark",
    state:"gas",
    tick:function(pixel){
        for (let i of adjacentCoords){
            let x=pixel.x+i[0], y=pixel.y+i[1];
            if (!isEmpty(x,y,true) && pixelMap[x][y].element==="shadow_sand"){
                changePixel(pixelMap[x][y],"shadow_evap");
            }
        }
        if (Math.random()<0.2) deletePixel(pixel.x,pixel.y);
    }
};



// ==================================================
// SECTION 2 — MATERIALS
// ==================================================

elements.dark_steel = {
    color:["#44474d","#50545c","#5a5f66"],
    behavior: behaviors.WALL,
    category:"dark",
    state:"solid",
    density:8000,
    insulate:true,
    tick:function(pixel){
        pixel.temp = 0;
        for (let i of adjacentCoords){
            let x=pixel.x+i[0], y=pixel.y+i[1];
            if (!isEmpty(x,y,true)){
                let other=pixelMap[x][y];
                if (elements[other.element].conduct>0 || other.element.includes("metal")){
                    other.temp+=500;
                }
            }
        }
    }
};

elements.liquid_night = {
    color:["#0f0f12","#141418","#1a1a1f"],
    behavior: behaviors.LIQUID,
    viscosity:5000,
    density:3000,
    category:"dark",
    state:"liquid",
    insulate:true,
    tick:function(pixel){
        pixel.temp=0;
        for (let i of adjacentCoords){
            let x=pixel.x+i[0], y=pixel.y+i[1];
            if (!isEmpty(x,y,true)){
                let other=pixelMap[x][y];
                other.temp=0;
                if (other.element==="lava") changePixel(other,"liquid_night");
            }
        }
    }
};



// ==================================================
// SECTION 3 — FLORA & LIFE
// ==================================================

elements.shadow_seed = {
    color:["#3a2f44","#4a3b55","#5a4a66"],
    behavior: behaviors.POWDER,
    density:800,
    category:"dark",
    state:"solid",
    tick:function(pixel){
        for (let i of adjacentCoords){
            let x=pixel.x+i[0], y=pixel.y+i[1];
            if (!isEmpty(x,y,true) && pixelMap[x][y].element==="dirt" && Math.random()<0.01){
                changePixel(pixelMap[x][y],"shadow_dirt");
            }
        }
        let belowY=pixel.y+1;
        if (!isEmpty(pixel.x,belowY,true) && pixelMap[pixel.x][belowY].element==="shadow_dirt"){
            if (Math.random()<0.002) growShadowTree(pixel);
        }
    }
};

elements.shadow_wood = {
    color:["#444","#555","#666"],
    behavior: behaviors.WALL,
    category:"dark",
    state:"solid"
};

elements.shadow_leaf = {
    color:["#2e2e2e","#383838","#424242"],
    behavior: behaviors.LEAF,
    category:"dark",
    state:"solid"
};

function growShadowTree(seed){
    let height=6+Math.floor(Math.random()*4);
    for (let i=1;i<=height;i++){
        if (isEmpty(seed.x,seed.y-i)) createPixel("shadow_wood",seed.x,seed.y-i);
    }
    deletePixel(seed.x,seed.y);
}



// ==================================================
// SECTION 4 — ENERGY
// ==================================================

elements.black_fire = {
    color:["#4b0082","#6a00ff","#8c1aff"],
    behavior: behaviors.FIRE,
    category:"dark",
    state:"gas",
    temp:-150,
    tick:function(pixel){
        pixel.temp=-150;
        for (let i of adjacentCoords){
            let x=pixel.x+i[0], y=pixel.y+i[1];
            if (!isEmpty(x,y,true)){
                let other=pixelMap[x][y];
                other.temp-=50;
                if (other.element==="fire"||other.element==="light") deletePixel(x,y);
            }
        }
        if (Math.random()<0.1) deletePixel(pixel.x,pixel.y);
    }
};

elements.shadow_lightning = {
    color:["#a64dff","#bf80ff","#e6ccff"],
    behavior: behaviors.GAS,
    category:"dark",
    state:"gas",
    density:0.1,
    temp:-200,
    tick:function(pixel){
        for (let i of adjacentCoords){
            let x=pixel.x+i[0], y=pixel.y+i[1];
            if (!isEmpty(x,y,true)){
                let other=pixelMap[x][y];
                other.temp-=200;
                if (other.element==="water") changePixel(other,"liquid_night");
            }
        }
        if (Math.random()<0.5) deletePixel(pixel.x,pixel.y);
    }
};



// ==================================================
// SECTION 5 — COSMIC
// ==================================================

elements.dark_matter = {
    color:["#2a2a2a","#333","#3d3d3d"],
    behavior: behaviors.GAS,
    category:"dark",
    state:"gas",
    density:9999,
    tick:function(pixel){
        for (let i of adjacentCoords){
            let x=pixel.x+i[0], y=pixel.y+i[1];
            if (!isEmpty(x,y,true)){
                let other=pixelMap[x][y];
                if (other.element!=="dark_matter"){
                    changePixel(other,"dark_solid");
                }
            }
        }
        if (Math.random()<0.01){
            let dir=[[1,0],[-1,0],[0,1],[0,-1]][Math.floor(Math.random()*4)];
            if (isEmpty(pixel.x+dir[0],pixel.y+dir[1])){
                createPixel("dark_matter",pixel.x+dir[0],pixel.y+dir[1]);
            }
        }
    }
};

elements.dark_solid = {
    color:["#1f1f1f","#292929"],
    behavior: behaviors.WALL,
    category:"none",
    hidden:true
};



// ==================================================
// SECTION 6 — APOCALYPSE TIER
// ==================================================

elements.black_matter = {
    color:["#0a0a0a","#111","#151515"],
    behavior: behaviors.GAS,
    category:"none",
    state:"gas",
    density:10000,
    hidden:true,
    tick:function(pixel){
        for (let i of adjacentCoords){
            let x=pixel.x+i[0], y=pixel.y+i[1];
            if (!isEmpty(x,y,true)){
                createPixel("void_burn",pixel.x,pixel.y);
                deletePixel(x,y);
                deletePixel(pixel.x,pixel.y);
                return;
            }
        }
    }
};

elements.void_burn = {
    color:["#050505","#080808"],
    behavior: behaviors.WALL,
    hidden:true
};

elements.abyss_constructing_mass = {
    color:["#ffffff","#f5f5f5","#eaeaea"],
    behavior: behaviors.LIQUID,
    category:"none",
    state:"liquid",
    density:20000,
    hidden:true,
    tick:function(pixel){
        for (let i of adjacentCoords){
            let x=pixel.x+i[0], y=pixel.y+i[1];
            if (!isEmpty(x,y,true)){
                let other=pixelMap[x][y];
                if (other.element!=="abyss_constructing_mass"){
                    elements[other.element].hidden=true;
                    deletePixel(x,y);
                }
            }
        }
    }
};
