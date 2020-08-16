// create all balls 
function createBalls(){
  var balls = Number(document.getElementById('numballs').value),
      radius = 15,
      rndXYin = rndXY(radius); // a function
  
  document.balls = [];
  
  if (balls > 0){
      // add first ball
      document.balls.push( new Ball(0, rndXYin(document.getElementById("box").width),
                               rndXYin(document.getElementById("box").height)));
      
      // add rest of balls making sure they do not over lap
      //  only enters loop if more than 1 ball
      for(var i = 1; i < balls; i++){
          
          var temp, test = true, distfrom;
          while(test){
              // create temp ball
              temp = new Ball(i, rndXYin(document.getElementById("box").width),
                               rndXYin(document.getElementById("box").height));
              // check to see if ball overlaps previous balls
              distfrom = document.balls.map( function(ball1){
                  return dist(ball1, temp) <= 2*radius;
              });
              
              distfrom = distfrom.reduce(function(prev, curr){
                  if(curr === true || prev === true) return true;
                  return false;
                  }, false);
              
              // if there is an overlap restart while 
              if(distfrom){                 
                  test = true;
              }
              else{   // no over lap add temp ball to list
                  document.balls.push(temp);
                  test = false;
              }
              
          }//while
          
      }//for
  }//if
}


// draw balls stored in document.balls on canvas
function drawBalls(){
  
  // clear canvas and then draw the balls on canvas
  var box =document.getElementById("box"),
      ctx = box.getContext('2d');
  
  ctx.fillStyle =  '#5353c6';//"red";  // color of balls
  
  // clear canvas
  ctx.clearRect(0,0,document.getElementById("box").width,
                document.getElementById("box").height);
  
  // draw each ball
  document.balls.forEach(function(val){
      ctx.beginPath();
      ctx.arc(val.x, val.y, 15, 0, 2 * Math.PI);
      ctx.fill();
  });
  
  // check if balls are colliding with wall and balls    
  //document.balls.forEach(collideWall);
  collideBall(newTrajectory);
  document.balls.forEach(collideWall);
  
  // update ball positions
  document.balls.forEach(updatePos);
  
}


// generate random x or y so ball will fit completely
//   into the box canvas, radius is radius of ball
function rndXY(radius){
  return function(heightOrWidth){ 
      return Math.round(Math.random()*(heightOrWidth - radius*2)) + radius;
  }
}



// ball object
function Ball(idx, x, y){
  this.idx = idx;
  this.radius = 15;
  this.x = x;
  this.y = y;
  
  // initial random position velocity vectors from 0 to 2
  this.dx = Math.random()*2; 
  this.dy = Math.random()*2;   
}

// update position
function updatePos(ballObj){
  ballObj.x = ballObj.x + ballObj.dx;
  ballObj.y = ballObj.y + ballObj.dy;
  
}



//*************** collision functions ****************

// return the distance between the centers of two balls
function dist(ball1, ball2){
  return Math.sqrt( Math.pow(ball1.x - ball2.x, 2) + Math.pow(ball1.y - ball2.y, 2) );
}

// check to see if ball hit another ball if they do 
//  do some process on them
function collideBall(process){
  var i, j, dis, disBalls, 
      ball = document.balls, 
      len = document.balls.length;
  
  for(i = 0; i < len; i++){
      for(j = i; j < len; j++){
          
          disBalls = ball[i].radius + ball[j].radius;
          dis = dist(ball[i],ball[j]);
          
          if(dis <= disBalls && dis !== 0){
              
              process(ball[i],ball[j]);
          }
      }
  }
}

// calculate new trajectory of colliding balls
function newTrajectory(ball1, ball2){
  // ball1 and ball2 collide and at point of collision
  //  we calculate the normal and tangenital vectors
  //  then use dot product on velocity vectors of each ball
  //  with the tangent and normal vectors 
  //  and use this to calculate after collision velocities
  //  assumes mass of balls are both equal to 1
      
  // calculate normal vector and unit normal vector
  var n = {   x: ball1.x-ball2.x,
              y: ball1.y - ball2.y }, 
      un = {  x: n.x/(Math.sqrt(Math.pow(ball1.x-ball2.x,2) +
                             Math.pow(ball1.y-ball2.y,2))),
              y: n.y/(Math.sqrt(Math.pow(ball1.x-ball2.x,2) +
                             Math.pow(ball1.y-ball2.y,2)))   },
  
  // calculate unit tangent vector
       ut = { x: -un.y,
              y: un.x  },
  
  // project ball velocities onto tangent & norm vectors 
  //  using dot product gives scalar values
      sv1n = un.x*ball1.dx + un.y*ball1.dy,
      sv1t = ut.x*ball1.dx + ut.y*ball1.dy, // does not change after collision
      
      sv2n = un.x*ball2.dx + un.y*ball2.dy,
      sv2t = ut.x*ball2.dx + ut.y*ball2.dy, // does not change after collision
      
  // calculate mag of velocities after collision for normal vectors
      sv1na = sv2n,
      sv2na = sv1n,
  
  // calculate the resulting after collision tangent
  //  and normal vectors fore each ball by multiplying
  //  dot products by unit vectors
      rv1n = { x: sv1na * un.x,
              y: sv1na * un.y },
      rv1t = { x: sv1t * ut.x,
              y: sv1t * ut.y },
      rv2n = { x: sv2na * un.x,
              y: sv2na * un.y },
      rv2t = { x: sv2t * ut.x,
              y: sv2t * ut.y };
  
  // sum the tangent and normal vectors for each ball and
  //  asign value to ball velocities
  ball1.dx = rv1n.x + rv1t.x;
  ball1.dy = rv1n.y + rv1t.y;
  
  ball2.dx = rv2n.x + rv2t.x;
  ball2.dy = rv2n.y + rv2t.y;
  
}




// check to see if ball hit walls and change trajectory if it does
function collideWall(ballObj){
  //x axis
  if(ballObj.x <= ballObj.radius ||
     ballObj.x >= (document.getElementById("box").width - ballObj.radius)){
      ballObj.dx = -ballObj.dx;
  }    
  
  // y axis
  if(ballObj.y <= ballObj.radius || 
     ballObj.y >= (document.getElementById("box").height - ballObj.radius)){
      ballObj.dy = -ballObj.dy;
  }  
}

function bounce(){
  var test = Number(document.getElementById("numballs").value);
  if(test >= 0 && test <= 5 ){
      document.getElementById("msg").innerHTML = "";
      createBalls();
      setInterval(drawBalls,20); // draw canvas every XXX ms
  }
  else{
      document.getElementById("msg").innerHTML = "Number of balls has to be in range 0 to 5.  Please try again!";
  }
}
