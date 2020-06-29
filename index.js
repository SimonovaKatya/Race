// в LS объекьы основа языка. любой элемент который мы получили объекты. 
const score = document.querySelector('.score'),
    start = document.querySelector('.start'),
    gameArea = document.querySelector('.gameArea'),
    car = document.createElement('div');// законченная инструкциия
car.classList.add('car');

//прослушиватель событий/ обработчик событий
start.addEventListener('click', startGame); // addEvent...метод
document.addEventListener('keydown', startRun); // обработчики событии. на 1 элемент можем наложить несколько обработчиков событий и даже дулироват. НАЖАТИЕ.
document.addEventListener('keyup', stopRun); // на документ вешаем событие keydown. т.е ЭТО СОБЫТИЕ СРАБАТЫВАЕТ КОГДА НА КЛАВИАТУРЕ НЕ СРАБАТЫВАЕТ/СРАБАТЫВАЕТ ЛЮБАААЯ КЛАВИША. ОТПУСКАНИЕ

// создаем объекст с названием клавишб, которые необходимы для управления автомобилем
const keys = {
    ArrowUp: false, // cвойста. имя: значение
    ArrowDown: false,
    ArrowRight: false,
    ArrowLeft: false
};

// создаем объект с первоначальными данными
const setting = {
    start: false, //статус игры
    score: 0, //кол-во очков
    speed: 6, //скорость игры
    traffic: 3 // будет влиять на сложность игры
};

function getQuantityElements(heightElement){
    return document.documentElement.clientHeight / heightElement + 1; //вычисляем длину нащей стр. и делим на высоту элемента
}

console.log(getQuantityElements(200)); // вызыв этой функции возвращает определнное значение

function startGame() {
    start.classList.add('hide');
    gameArea.innerHTML = ''; // отчищаем арену. чтобы продолжить игру.
    
    for(let i = 0; i < getQuantityElements(100); i++){
        const line = document.createElement('div');
        line.classList.add('line');
        line.style.top = (i * 100) +'px'; // расстоние м/у линиями
        line.y = i * 100;
        gameArea.appendChild(line);
    }

    for(let i = 0; i <getQuantityElements(100 * setting.traffic); i++){
       const enemy = document.createElement('div');
       enemy.classList.add('enemy');
       enemy.y = -100 * setting.traffic * (i + 1); 
       enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
       enemy.style.top = enemy.y + 'px';
       enemy.style.background = 'transparent url(\'./image/enemy.png\') center / cover no-repeat';
       gameArea.appendChild(enemy); 
    }
    setting.score = 0;
    setting.start = true; //обращаемся к нашему объеку setting через точку образемся к св-ву start и присваем новое значение true
    gameArea.appendChild(car);
    car.style.left = gameArea.offsetWidth/2 - car.offsetWidth/2;
    car.style.top = 'auto';
    car.style.bottom = '10px';
    setting.x = car.offsetLeft;
    setting.y = car.offsetTop;
    requestAnimationFrame(playGame); // функция requestAnimationFrame запускает функцию , которая указана в скобках
}

function playGame() {
   
    if (setting.start) {
        setting.score += setting.speed;
        score.innerHTML ='SCORE<br>' + setting.score;
        moveRoad();
        moveEnemy();
        if(keys.ArrowLeft && setting.x>0){
            setting.x -= setting.speed; // значение х уменешили на 1
        }

        if(keys.ArrowRight && setting.x < (gameArea.offsetWidth - 50)) {
            setting.x += setting.speed;
        }

        if(keys.ArrowDown && setting.y <(gameArea.offsetHeight - car.offsetHeight)){
            setting.y += setting.speed;
        }

        if(keys.ArrowUp && setting.y>0){
            setting.y -= setting.speed;
        }
        car.style.left = setting.x + 'px';
        car.style.top = setting.y + 'px';
        requestAnimationFrame(playGame);
    }
    //requestAnimationFrame(playGame); // чтобы функция не останавливалась и сама себя перезапускала мы пишем эту же строчку в функции PLAYGAME
}

function startRun(event) { // СОЗДАЕТСЯ объект event. объект содержит множество данных. какая клавиша нажата и тд.
    event.preventDefault(); // отменяет естественное поведение браузера.( типо скролл)
    console.log(event.key); // в консоле отображается какую клавишу нажали
    keys[event.key] = true;
}

function stopRun(event) {
    event.preventDefault();
    console.log('stop');
    keys[event.key] = false;
}

function moveRoad() {
 let lines = document.querySelectorAll('.line'); //получаем все линии , которые есть на стр
 lines.forEach(function(line) { // как назовем параметр не важно.
  line.y += setting.speed;
  line.style.top = line.y + 'px'; 
  
  if(line.y >= document.documentElement.clientHeight){
      line.y = -100;
  }

 });
}

function moveEnemy(){
  let enemy = document.querySelectorAll('.enemy'); //получаем все линии, которые есть на стр
  enemy.forEach(function(enemys){ //переберм с помощью этого метода.
      let carRect = car.getBoundingClientRect();
      let enemyRect = enemys.getBoundingClientRect();

      if(carRect.top<=enemyRect.bottom &&
         carRect.right>=enemyRect.left &&
         carRect.left<=enemyRect.right &&
         carRect.bottom >= enemyRect.top){
             setting.start = false;
             start.classList.remove('hide');
             start.style.top = score.offsetHeight;// старт отталкивается от score
         }
      enemys.y += setting.speed/2;
      enemys.style.top = enemys.y + 'px';
      if(enemys.y >= document.documentElement.clientHeight){
      enemys.y = -100 * setting.traffic;
      enemys.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
    }
  });

  
}


// построение анимации. создаем анимацию с помощью функции timeout-ов
// УСТАРЕЛИ ДЛЯ АНИМАЦИИ
// setTimeOut-запускатеся через какое-то время которое мы укажем и запускатеся он единожды
// setInterval-запускается ТОЖЕ через определенное время и то время которое мы укажем будет интервалом запуска функции. т.е например 200мс. это значит каждые 2000мс секунд запускаем этот сетинтервал