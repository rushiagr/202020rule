### Another way to implement `playSound` function
```
//@param filename The name of the file WITHOUT ending
function playSound(filename){   
    document.getElementById("sound").innerHTML='<audio autoplay="autoplay"><source src="' + filename + '.mp3" type="audio/mpeg" /><source src="' + filename + '.ogg" type="audio/ogg" /><embed hidden="true" autostart="true" loop="false" src="' + filename +'.mp3" /></audio>';
}
```

### Website for some pretty cool short tones:
    http://oringz.com/
