(function(){
    function Plugin(){};
    function Meme(){};

    Plugin.prototype.init = function (parent, memeImages, memeParams){
        var params = Object.assign({
            delay : 1000,
            height : 150,
            width : 150
        }, memeParams);
        //instance count
        this.nbInstance;
        if(this.nbInstance === undefined){
            this.nbInstance = 0;
        } else {
            this.nbInstance++;
        }

        var meme = new Meme();
        meme.nb = this.nbInstance;
        meme.parent = parent;
        meme.images = memeImages;
        meme.delay = params.delay;
        meme.height = params.height;
        meme.width = params.width;
        // meme.block = false;
        meme.imgCompare = [];
        meme.imgOk = []

        createMeme(meme);
    }

    //fonctions privées
    function createMeme(instance) {
        //creation de la div contenant les Boutons
        var parent = $("#"+instance.parent);

        //duplication du tableau
        instance.images2 = instance.images;
        instance.Meme = instance.images.concat(instance.images2);

        //creation d'un tableau d'images en doubles mélangées aléatoirement
        instance.cloneMeme = []
        instance.usedIndex = []
        var i = 0;
        while (instance.cloneMeme.length !== instance.Meme.length){
            do {
                var rand = Math.floor(Math.random()*instance.Meme.length);
            } while (instance.usedIndex.indexOf(rand) !== -1)
            instance.cloneMeme[i] = instance.Meme[rand];
            instance.usedIndex.push(rand);
            i++;
        }

        // creation des images
        instance.cloneMeme.forEach(function(image, id){
            createImg(instance, parent, image, id, instance.delay, instance.height, instance.width);
        });
    };

    //fonction de création des images
    function createImg(instance, parent, image, id, delay, height, width) {
        var div = document.createElement("div");
        div.addEventListener('click', function(){
            show(instance, id, delay)
        });
        div.setAttribute("style", "height:"+height+"px;width:"+width+"px");
        div.className = "divimg";
        var img = document.createElement("img");
        img.setAttribute("src", image);
        img.classeName = "img";
        img.id = "img-" + id + "-" + instance.nb;
        img.setAttribute("height", height);
        img.setAttribute("width", width);
        img.setAttribute("style", "visibility:hidden");
        div.append(img);
        parent.append(div);
    };

    function show(instance, id, delay) {
        if(!instance.block){
            var ok = true;

            //test if img hasn't already been clicked
            instance.imgCompare.forEach(function(imgId){
                if (id === imgId) {
                    ok = false
                }
            });
            //or img has'nt already been validated
            instance.imgOk.forEach(function(imgId){
                if (id === imgId) {
                    ok = false
                }
            });
            if (ok && instance.imgCompare.length < 2){
                document.querySelector("#img-"+id+ "-" + instance.nb).setAttribute("style", "visibility:visible");
                instance.imgCompare.push(id);
            }
        }
        //if two images are shown, block
        if (instance.imgCompare.length === 2){
            instance.block = true;
        }
        //if block, compare two images clicked
        if (instance.block){
            var id0 = instance.imgCompare[0];
            var id1 = instance.imgCompare[1];
            //if images are différents, hide them
            if(document.querySelector("#img-"+ id0 + "-" + instance.nb).src !== document.querySelector("#img-" + id1 + "-" + instance.nb).src){
                setTimeout(function(){
                    //hide images
                    hide(instance, id0, id1);
                    //clear this.imgCompare[]
                    instance.imgCompare = [];
                    //unblock
                    instance.block = false;
                }, delay);
            } else {
                //else push them to this.imgOk[]
                instance.imgOk.push(id0);
                instance.imgOk.push(id1);
                setTimeout(function(){
                    //clear this.imgCompare[]
                    instance.imgCompare = [];
                    //unblock
                    instance.block = false;
                }, delay);
            }
            //alert if win
            if(instance.imgOk.length === instance.cloneMeme.length){
                alert("WELL DONE")
            }

        }


    };

    function hide(instance, id0,id1) {
        document.querySelector("#img-"+id0+ "-" + instance.nb).setAttribute("style", "visibility:hidden");
        document.querySelector("#img-"+id1+ "-" + instance.nb).setAttribute("style", "visibility:hidden");
    }

    // affectation du plugin à window
    this.Mememory = new Plugin();
})();
