// ==================================================
// DARK ELEMENTS MOD — FULLY COMBINED, CINEMATIC, CRASH SAFE
// ==================================================

// =======================
// HELPERS
// =======================
const adjacentCoords=[[0,1],[1,0],[0,-1],[-1,0]];

function isEmpty(x,y,allowOut=false){
    if(x<0||y<0||x>=width||y>=height) return allowOut;
    return (!pixelMap[x] || !pixelMap[x][y]);
}

function createPixel(element,x,y,temp){
    if(isEmpty(x,y)) pixels.push({element,x,y,temp:temp||0});
}

function deletePixel(x,y){
    if(!isEmpty(x,y,true)) pixels.splice(pixels.findIndex(p=>p.x===x&&p.y===y),1);
}

function movePixel(pixel,x,y){
    if(isEmpty(x,y)) {pixel.x=x; pixel.y=y;}
}

// =======================
// TERRAIN
// =======================
elements.shadow_sand={
    color:["#1a001f","#24002b","#2e0038","#3a0047"],
    behavior: behaviors.POWDER, category:"dark", state:"solid", density:1600,
    tick:function(pixel){
        for(let i of adjacentCoords){
            let x=pixel.x+i[0], y=pixel.y+i[1];
            if(!isEmpty(x,y,true) && pixelMap[x][y].element==="light") deletePixel(pixel.x,pixel.y);
        }
    }
};

elements.shadow_dirt={
    color:["#1a1a1a","#222222","#2b2b2b","#333333"],
    behavior: behaviors.POWDER, category:"dark", state:"solid", density:1700,
    tick:function(pixel){
        for(let i of adjacentCoords){
            let x=pixel.x+i[0], y=pixel.y+i[1];
            if(!isEmpty(x,y,true) && pixelMap[x][y].element==="light") deletePixel(pixel.x,pixel.y);
        }
    }
};

// =======================
// MATERIALS
// =======================
elements.dark_steel={
    color:["#44474d","#50545c","#5a5f66"],
    behavior: behaviors.WALL, category:"dark", state:"solid", density:8000,
    tick:function(pixel){pixel.temp=0;}
};

elements.liquid_night={
    color:["#0f0f12","#141418","#1a1a1f"],
    behavior: behaviors.LIQUID, viscosity:5000, density:3000, category:"dark", state:"liquid",
    tick:function(pixel){pixel.temp=0;}
};

// =======================
// FLORA
// =======================
elements.shadow_seed={
    color:["#3a2f44","#4a3b55","#5a4a66"],
    behavior: behaviors.POWDER, density:800, category:"dark", state:"solid",
    tick:function(pixel){
        for(let i of adjacentCoords){
            let x=pixel.x+i[0], y=pixel.y+i[1];
            if(!isEmpty(x,y,true) && pixelMap[x][y].element==="dirt" && Math.random()<0.002)
                pixelMap[x][y].element="shadow_dirt";
        }
        if(!pixel.age) pixel.age=0;
        pixel.age++;
        if(pixel.age>500 && Math.random()<0.01) growShadowTree(pixel);
    }
};

function growShadowTree(seed){
    let height=6+Math.floor(Math.random()*4);
    for(let i=1;i<=height;i++){
        if(isEmpty(seed.x,seed.y-i)) createPixel("shadow_wood",seed.x,seed.y-i);
    }
    deletePixel(seed.x,seed.y);
}

elements.shadow_wood={color:["#444","#555","#666"],behavior:behaviors.WALL,category:"dark",state:"solid"};
elements.shadow_leaf={color:["#2e2e2e","#383838","#424242"],behavior:behaviors.LEAF,category:"dark",state:"solid"};

// =======================
// ENERGY
// =======================
elements.black_fire={
    color:["#4b0082","#6a00ff","#8c1aff"],
    behavior: behaviors.FIRE, category:"dark", state:"gas", temp:-150,
    tick:function(pixel){
        pixel.temp=-150;
        for(let i of adjacentCoords){
            let x=pixel.x+i[0], y=pixel.y+i[1];
            if(!isEmpty(x,y,true) && (pixelMap[x][y].element==="fire"||pixelMap[x][y].element==="light"))
                deletePixel(x,y);
        }
        if(Math.random()<0.1) deletePixel(pixel.x,pixel.y);
    }
};

elements.shadow_lightning={
    color:["#a64dff","#bf80ff","#e6ccff"], behavior:behaviors.GAS,
    category:"dark", state:"gas", temp:-200,
    tick:function(pixel){
        for(let i of adjacentCoords){
            let x=pixel.x+i[0], y=pixel.y+i[1];
            if(!isEmpty(x,y,true) && pixelMap[x][y].element==="water")
                pixelMap[x][y].element="liquid_night";
        }
        if(Math.random()<0.5) deletePixel(pixel.x,pixel.y);
        // CINEMATIC SPARK
        if(Math.random()<0.1){
            let sparkDir=adjacentCoords[Math.floor(Math.random()*4)];
            let sx=pixel.x+sparkDir[0], sy=pixel.y+sparkDir[1];
            if(isEmpty(sx,sy)) createPixel("shadow_lightning_spark",sx,sy);
        }
    }
};

elements.shadow_lightning_spark={
    color:["#c880ff","#d0a0ff","#e6ccff"], behavior:behaviors.GAS,
    state:"gas", density:1, category:"dark", hidden:true,
    tick:function(pixel){if(Math.random()<0.5) deletePixel(pixel.x,pixel.y);}
};

// =======================
// COSMIC
// =======================
elements.dark_matter={
    color:["#2a2a2a","#333","#3d3d3d"], behavior:behaviors.GAS,
    category:"dark", state:"gas", density:9999,
    tick:function(pixel){
        for(let i of adjacentCoords){
            let x=pixel.x+i[0], y=pixel.y+i[1];
            if(!isEmpty(x,y,true) && pixelMap[x][y].element!=="dark_matter")
                pixelMap[x][y].element="dark_solid";
        }
        if(Math.random()<0.002){
            let dir=adjacentCoords[Math.floor(Math.random()*4)];
            let nx=pixel.x+dir[0], ny=pixel.y+dir[1];
            if(isEmpty(nx,ny)) createPixel("dark_matter",nx,ny);
        }
        // CINEMATIC shimmer trail
        if(Math.random()<0.1){
            let trailDir=adjacentCoords[Math.floor(Math.random()*4)];
            let tx=pixel.x+trailDir[0], ty=pixel.y+trailDir[1];
            if(isEmpty(tx,ty)) createPixel("dark_matter_trail",tx,ty);
        }
    }
};

elements.dark_matter_trail={color:["#3a3a3a","#444444"],behavior:behaviors.GAS,density:9999,
    category:"dark", state:"gas", hidden:true, tick:function(pixel){if(Math.random()<0.5) deletePixel(pixel.x,pixel.y);}
};

elements.dark_solid={color:["#1f1f1f","#292929"],behavior:behaviors.WALL,category:"none",hidden:true};

elements.black_matter={
    color:["#0a0a0a","#111","#151515"], behavior:behaviors.GAS,
    category:"none", state:"gas", density:10000, hidden:true,
    tick:function(pixel){
        for(let i of adjacentCoords){
            let x=pixel.x+i[0], y=pixel.y+i[1];
            if(!isEmpty(x,y,true)){
                createPixel("void_burn",pixel.x,pixel.y);
                deletePixel(x,y); deletePixel(pixel.x,pixel.y); return;
            }
        }
    }
};

elements.void_burn={color:["#050505","#080808"],behavior:behaviors.WALL,hidden:true};

elements.abyss_constructing_mass={
    color:["#ffffff","#f5f5f5","#eaeaea"], behavior:behaviors.LIQUID,
    category:"none", state:"liquid", density:20000, hidden:true,
    tick:function(pixel){
        for(let i of adjacentCoords){
            let x=pixel.x+i[0], y=pixel.y+i[1];
            if(!isEmpty(x,y,true)){
                let other=pixelMap[x][y];
                if(other.element!=="abyss_constructing_mass"){elements[other.element].hidden=true; deletePixel(x,y);}
            }
        }
        if(!pixel.age) pixel.age=0; pixel.age++;
        if(pixel.age%30===0) pixel.color=["#ffffff","#eaeaea","#f5f5f5"][Math.floor(Math.random()*3)];
        // Tiny split
        if(Math.random()<0.01){
            let dir=adjacentCoords[Math.floor(Math.random()*4)];
            let nx=pixel.x+dir[0], ny=pixel.y+dir[1];
            if(isEmpty(nx,ny)) createPixel("abyss_constructing_mass_small",nx,ny);
        }
    }
};

elements.abyss_constructing_mass_small={
    color:["#f0f0f0","#e6e6e6"], behavior:behaviors.LIQUID, density:20000,
    category:"none", state:"liquid", hidden:true, tick:function(pixel){if(Math.random()<0.3) deletePixel(pixel.x,pixel.y);}
};

// =======================
// DARK TENDRILS
// =======================
elements.dark_tendril={
    color:["#4b0082","#5c00a3","#6f00cc"], behavior:behaviors.POWDER,
    category:"dark", state:"solid", density:500,
    tick:function(pixel){
        if(!pixel.age) pixel.age=0; pixel.age++;
        let dirs=[[1,0],[-1,0],[0,1],[0,-1]];
        if(Math.random()<0.5){let d=dirs[Math.floor(Math.random()*4)]; let nx=pixel.x+d[0], ny=pixel.y+d[1]; if(isEmpty(nx,ny)) movePixel(pixel,nx,ny);}
        if(Math.random()<0.02){
            for(let i of adjacentCoords){
                let x=pixel.x+i[0], y=pixel.y+i[1];
                if(!isEmpty(x,y,true)){
                    let other=pixelMap[x][y];
                    if(other.element==="shadow_sand" || other.element==="shadow_dirt"){
                        deletePixel(x,y); let d=dirs[Math.floor(Math.random()*4)];
                        let nx=pixel.x+d[0], ny=pixel.y+d[1]; if(isEmpty(nx,ny)) createPixel(other.element,nx,ny);
                    }
                }
            }
        }
        if(pixel.temp && pixel.temp<0 && Math.random()<0.05){let d=dirs[Math.floor(Math.random()*4)]; let nx=pixel.x+d[0], ny=pixel.y+d[1]; if(isEmpty(nx,ny)) createPixel("dark_tendril",nx,ny);}
    }
};

// =======================
// SHADOW CLOUDS
// =======================
elements.shadow_cloud={
    color:["#2a2a2a","#333333","#3d3d3d"], behavior:behaviors.GAS,
    category:"dark", state:"gas", density:2, temp:-50,
    tick:function(pixel){
        if(isEmpty(pixel.x,pixel.y+1)) movePixel(pixel,pixel.x,pixel.y+1);
        if(Math.random()<0.05) pixel.color=["#4b0082","#5c00a3","#6f00cc"][Math.floor(Math.random()*3)];
        if(Math.random()<0.03 && isEmpty(pixel.x,pixel.y+1)) createPixel("liquid_night",pixel.x,pixel.y+1);
        if(Math.random()<0.01 && isEmpty(pixel.x,pixel.y+1)) createPixel("shadow_lightning",pixel.x,pixel.y+1);
        for(let i of adjacentCoords){
            let x=pixel.x+i[0], y=pixel.y+i[1];
            if(!isEmpty(x,y,true)){
                let other=pixelMap[x][y];
                if(other.element==="cloud" && !other.infected) other.infected=true;
                if(other.infected && Math.random()<0.02) other.element="shadow_cloud";
            }
        }
    }
};
