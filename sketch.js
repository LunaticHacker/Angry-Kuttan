// Angry Birds
// Daniel Shiffman
// https://thecodingtrain.com/CodingChallenges/138-angry-birds.html
// https://youtu.be/TDQzoe9nslY

const {
  Engine,
  World,
  Bodies,
  Mouse,
  MouseConstraint,
  Constraint,
  Events
} = Matter;

let ground;
let boxes = [];
let bird;
let world, engine;
let mConstraint;
let slingshot;
let pipes = [];
let dotImg;
let boxImg;
let bkgImg;
let tries = 1;
let sel;
let level = 1;
let currentlevel = 1;
let levelsel;

function preload() {
  dotImg = loadImage('images/sabi.png');
  shibinImg = loadImage('images/shibin.png');
  sabiImg = loadImage('images/sabi.png');
  chechiImg = loadImage('images/chechi.png');
  kozhiImg = loadImage('images/kozhi.png');
  jefinImg = loadImage('images/jefin.png');
  nidhishaImg = loadImage('images/nidhisha.png');
  boxImg = loadImage('images/kuttan.jpeg');
  bkgImg = loadImage('images/skyBackground.png');
  eda = loadSound('sound/edadasa.mp3');
  kozhi = loadSound('sound/kozhi.mp3');
  chechi = loadSound('sound/chechi.mp3');
  kuttandead = loadSound('sound/kuttandead.mp3');
  punch = loadSound('sound/punch.mp3');

}

function setup() {
  const canvas = createCanvas(2000, window.innerHeight - 50);
  background(bkgImg);
  engine = Engine.create();
  world = engine.world;
  //console.log(engine.world.bounds);
  ground = new Ground(width / 2, height - 10, width, 20);
  //  wall1 = new Ground(0,0,20,width);
  //wall2 = new Ground(width,0,20,width);
  for (let i = 0; i < 3; i++) {
    boxes[i] = new Box(1500 + i * 100, 300, 84, 84);
  }

  for (let i = 0; i <= currentlevel * 4; i++) {
    pipes[i] = new Pipe(1200, height - i * 50, 80, 25);

  }



  function collision(event) {
    var pairs = event.pairs;
    for (pair of pairs) {
      if (pair.bodyA.label == "us" && pair.bodyB.label == "kuttan") {
        if (!punch.isPlaying())
          punch.play();

        for (var i = boxes.length - 1; i >= 0; --i) {
          console.log(boxes[i]);
          console.log(pair.bodyB.id);
          if (boxes[i].body.id == pair.bodyB.id) {
            console.log(boxes[i]);
            boxes.splice(i, 1);
            World.remove(world, pair.bodyB);
            break;
          }
        }


      }

      if (pair.bodyA.label == "kuttan" && pair.bodyB.label == "us") {
        if (!punch.isPlaying())
          punch.play();

        for (var i = boxes.length - 1; i >= 0; --i) {
          console.log(boxes[i]);
          console.log(pair.bodyA.id);
          if (boxes[i].body.id == pair.bodyA.id) {
            console.log(boxes[i]);
            boxes.splice(i, 1);
            World.remove(world, pair.bodyA);
            break;
          }
        }

      }
    }
  }

  Events.on(engine, "collisionStart", collision);

  bird = new Bird(150, height / 2, 25);


  slingshot = new SlingShot(150, height / 2, bird.body);

  const mouse = Mouse.create(canvas.elt);
  const options = {
    mouse: mouse,
  }

  // A fix for HiDPI displays
  mouse.pixelRatio = pixelDensity();
  mConstraint = MouseConstraint.create(engine, options);
  mConstraint.collisionFilter.mask = 0x0002;
  World.add(world, mConstraint);
  Events.on(mConstraint, "enddrag", dragend);

  sel = createSelect();
  sel.position(10, 10);
  sel.option('sabi');
  sel.option('shibin');
  sel.option('chechi');
  sel.option('kozhi');
  sel.option('jefin');
  sel.option('nidhisha');
  sel.changed(mySelectEvent);

  levelsel = createSelect();
  levelsel.position(70, 10);
  for (var i = 1; i <= level; i++) {
    levelsel.option("Level " + i);
  }
  levelsel.changed(levelChanged);




  function levelChanged() {
    tries = 1;
    var levelstring = levelsel.value();
    currentlevel = Number(levelstring[levelstring.length - 1]);
    if (currentlevel == 0) currentlevel = 10;
    for (var i = 0; i < boxes.length; i++) {
      World.remove(world, boxes[i].body);
    }
    boxes = [];
    for (let i = 0; i < 3; i++) {
      boxes[i] = new Box(1500 + i * 100, 300, 84, 84);
    }
    for (var i = 0; i < pipes.length; i++) {
      World.remove(world, pipes[i].body)
    }
    pipes = [];
    for (let i = 0; i <= currentlevel * 4; i++) {
      pipes[i] = new Pipe(1200, height - i * 50, 80, 25);

    }
    loop();
  }


  function mySelectEvent() {
    console.log(sel.value());

    if (sel.value() == "sabi") {
      dotImg = sabiImg;
    } else if (sel.value() == "chechi") {
      if (level >= 3) {
        dotImg = chechiImg;
        chechi.play();
      } else {
        alert("Chechi will be unlocked at level 3")
      }

    } else if (sel.value() == "jefin") {
      if (level >= 5) {
        dotImg = jefinImg;
      } else {
        alert("Jefin will be unlocked at level 5")
      }

    } else if (sel.value() == "nidhisha") {
      if (level >= 6) {
        dotImg = nidhishaImg;
      } else {
        alert("Nidhisha will be unlocked at level 6")
      }

    } else if (sel.value() == "kozhi") {
      if (level >= 4) {
        dotImg = kozhiImg;
        kozhi.play();
      } else {
        alert("Kozhi will be unlocked at level 4")
      }

    } else {
      if (level >= 2) {
        dotImg = shibinImg;
        eda.play();
      } else {
        alert("Shibin will be unlocked after level 1")
      }


    }
  }


}

function keyPressed() {
  if (key == ' ') {
    tries++;
    var birdx = bird.body.position.x;
    if (birdx >= 0)
      window.scrollBy(-bird.body.position.x, 0)
    else
      window.scrollBy(bird.body.position.x, 0)
    World.remove(world, bird.body);
    bird = new Bird(150, height / 2, 25);
    slingshot.attach(bird.body);
    // for (let i = 2; i >= 0; i--) {
    //   World.remove(world,boxes[i].body);
    //   boxes.splice(i,1);
    //   box = new Box(1500+i*100, 300 , 84, 84);
    //   boxes.push(box);
    //
    // }

  }

}

function dragend() {
  setTimeout(() => {
    slingshot.fly();
  }, 100);
  bird.body.collisionFilter.category = 0x0001;
}



function draw() {

  background(bkgImg);
  Matter.Engine.update(engine);
  ground.show();
  //wall1.show();
  //wall2.show();
  if (level == 10 || currentlevel == 10) {
    text("This is a demo we can't proceed any further...", width / 2 - 50, height / 2);
    noLoop();
  }

  if (boxes.length == 0) {
    // for(var i =0; i<3;i++){
    // box = new Box(1100+i*80, 300 , 84, 84);
    // boxes.push(box);
    textSize(32);
    text("YOU KILLED KUTTAN IN " + tries + " TRIES", width / 2 - 50, height / 2);
    if (!kuttandead.isPlaying())
      kuttandead.play();

    noLoop();
    setTimeout(() => {
      window.scrollTo(0, 0)
      if (currentlevel == level)
        level++;
      setup();


    }, 2300);

  }






  for (let box of boxes) {
    box.show();
  }
  for (let pipe of pipes) {
    pipe.show();
  }
  slingshot.show();
  bird.show();
  if (bird.body.position.x > 150 && bird.body.collisionFilter.category == 0x0001)
    window.scrollBy(bird.body.position.x, 0)
}
