function whosPaying(names) {
    
    /******Don't change the code above*******/

        
        //Write your code here.
        var winner = Math.random() * names.length;
        winner = Math.floor(winner);
        console.log(winner);
        return `${names[winner]} is going to buy lunch today!`
    
    
    /******Don't change the code below*******/    
    }
    
    names = ["Angela", "Ben", "Jenny", "Michael", "Chloe"];
    console.log(whosPaying(names));