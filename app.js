window.onload = function(){
    var Character = function(data){
        this.name = data.name;
        this.description = data.description;
        this.attack = data.attack;
        this.health = data.health;
        this.isVillain = data.isVillain;
    };
    Character.prototype.attackEnemy = function(enemy){
        enemy.health = enemy.health - this.attack;
        if (enemy.health < 0){
            enemy.health = 0;
        }
    };
    Character.prototype.isDead = function(){
        return this.health <= 0;
    };
    
    var Planet = function(data){
        this.name = data.name;
        this.heroAttackModifier = data.modifiers.heroAttackModifier;
        this.heroHealthModifier = data.modifiers.heroHealthModifier;
        this.villainAttackModifier = data.modifiers.villainAttackModifier;
        this.villainHealthModifier = data.modifiers.villainHealthModifier;
    };
    Planet.prototype.applyModifiers = function(visitor){
        if(visitor.isVillain){
            visitor.health = visitor.health + this.villainHealthModifier;
            visitor.attack = visitor.attack + this.villainAttackModifier;
        } else{
            visitor.health = visitor.health + this.heroHealthModifier;
            visitor.attack = visitor.attack + this.heroAttackModifier; 
        }
    };
    
    var currentPlanet;
    var superhero;
    var villain;
    var isHeroAttacked = false;
    var gamePanel = document.getElementById("game");
    var optionsPanel = document.getElementById("options");
    
    function renderMessage(message){
        gamePanel.innerHTML = gamePanel.innerHTML + " > " + message + "<br />";
    }
    
    function renderPlanets(){
        var selectHtml = "<select id='planets-select'><option disabled='true' selected='true'>select a planet</option>";
        for(var i = 0; i < planets.length; i++){
            selectHtml = selectHtml + "<option value='" + planets[i].id + "'>" +  planets[i].name + "</option>";
        }
        selectHtml = selectHtml + "</select>";
       optionsPanel.innerHTML = optionsPanel.innerHTML + selectHtml;
        
    }
    
    function renderSuperHeroes(){
        var selectHtml = "<select id= 'superheroes-select'><option disabled='true' selected='true'>select a hero</option>";
        for(var i = 0;i < characters.length; i++){
            if(characters[i].isVillain === false){
                selectHtml = selectHtml + "<option value='" + characters[i].id + "'>" + characters[i].name + "</option>";
            }
        }
        selectHtml = selectHtml + "</select>";
       
        optionsPanel.innerHTML = optionsPanel.innerHTML + selectHtml;
    }
    
    function renderVillains(){
        var selectHtml = "<select id='villains-select'><option disabled='true' selected='true'>select a villain</option>";
        for(var i = 0;i < characters.length; i++){
            if(characters[i].isVillain === true){
                selectHtml = selectHtml + "<option value='" + characters[i].id+"'>" + characters[i].name + "</option>";
            }
        }
        selectHtml = selectHtml + "</select>";
        optionsPanel.innerHTML = optionsPanel.innerHTML + selectHtml;
    }
    
    function bindEvents(){
        document.getElementById("planets-select").addEventListener("change", function(event){
            var id = event.target.value;
            for(var i = 0; i < planets.length; i++){
                if(id == planets[i].id){
                    currentPlanet = new Planet(planets[i]);
    
                    break;
                }
            }
            console.log("planetsChange", currentPlanet);
        });
        document.getElementById("superheroes-select").addEventListener("change", function(event){
            var id = event.target.value;
            for(var i = 0;i < characters.length; i++){
                if(id == characters[i].id){
                    superhero = new Character(characters[i]);
                    
                    break;
                }
            }
            console.log("heroChange", superhero);
        });
        document.getElementById("villains-select").addEventListener("change", function(event){
            var id = event.target.value;
            var id = event.target.value;
            for(var i = 0;i < characters.length; i++){
                if(id == characters[i].id){
                    villain = new Character(characters[i]);
                    break;
                }
            }
            console.log("villainChange", villain);
        });

        document.getElementById("start-game").addEventListener("click", function(event){
            if (!currentPlanet || !superhero || !villain) {
                return false;
            }
            document.getElementById("start-game").disabled = true;
            currentPlanet.applyModifiers(villain);
            currentPlanet.applyModifiers(superhero);
            isHeroAttacked = Math.random() < 0.5;
            renderMessage("Game started on planet " + currentPlanet.name);
           var gameUpdate = setInterval(function(){
                if(isHeroAttacked) {
                    villain.attackEnemy(superhero);
                    renderMessage("Villain " + villain.name + " attacked superhero " + superhero.name + " with " + villain.attack + " damage.");
                    renderMessage("Left health for superhero " + superhero.name + " is " + superhero.health);
                } else {
                    superhero.attackEnemy(villain);
                    renderMessage("Superhero " + superhero.name + " attacked villain " + villain.name + " with " + superhero.attack + " damage.");
                    renderMessage("Left health for villain " + villain.name + " is " + villain.health);
                }
                
                isHeroAttacked = !isHeroAttacked;
                if(villain.isDead() || superhero.isDead()){
                    clearInterval(gameUpdate);
                    if(!villain.isDead()){
                        renderMessage("Villain " + villain.name + " won: " + villain.description);
                    } else {
                        renderMessage("Superhero " + superhero.name + " won: " + superhero.description);
                    }
                    renderMessage("Refresh the page to start another game");
                }
            }, 1000);
        
        });
    
    }
    
    renderPlanets();
    renderSuperHeroes();
    renderVillains();
    bindEvents();
}