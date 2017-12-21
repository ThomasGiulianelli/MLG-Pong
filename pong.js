var canvas = document.getElementById("myCanvas");
            var ctx = canvas.getContext("2d");
            var x = canvas.width/2;
            var y = canvas.height/3;
            var dx = 8; //ball's change in x position 
            var dy = 3; //ball's change in y position
            var ballRadius = 10;
            var leftPaddleHeight = 100;
            var leftPaddleWidth = 20;
            var leftPaddleX = 2 * leftPaddleWidth;
            var leftPaddleY = canvas.height/2 - leftPaddleHeight/2;
            var rightPaddleHeight = 100;
            var rightPaddleWidth = 20;
            var rightPaddleX = canvas.width - (3 * rightPaddleWidth);
            var rightPaddleY = canvas.height/2 - rightPaddleHeight/2;
            var rectY = 15; //y coordinate of each rectangle in the dividing line
            var i = 0; //used in for loop
            var wPressed = false;
            var sPressed = false;
            var upPressed = false;
            var downPressed = false;
            var leftScore = 0;
            var rightScore = 0;
            var hitRightPaddle = false; //stores whether or not the ball has hit the paddle
            var hitLeftPaddle = false; //stores whether or not the ball has hit the paddle
            var wallBounceSFX = document.getElementById('ball-wall'); //used to play sfx when the ball bounces off a wall
            var paddleBounceSFX = document.getElementById('ball-paddle'); //used to play sfx when the ball bounces off a paddle
            var goalSFX = document.getElementById('airhorn'); //used to play sfx when a player scores
            var tripleSFX = document.getElementById('triple'); //used to play sfx when a player scores 3 points
            var winSFX = document.getElementById('MLG-airhorn'); //used to play sfx when a player wins
            var leftStartX = 0 - leftPaddleWidth; //starting x position of the left paddle before it tweens into its final position
            var rightStartX = canvas.width; //starting x position of the right paddle before it tweens into its final position
            var paddleTweeningDone = false;
            
            document.addEventListener("keydown", keyDownHandler, false);
            document.addEventListener("keyup", keyUpHandler, false);
            
            function keyDownHandler(e) {
                if(e.keyCode == 38)
                    upPressed = true;
                else if(e.keyCode == 40)
                    downPressed = true;
                else if(e.keyCode == 87)
                    wPressed = true;
                else if(e.keyCode == 83)
                    sPressed = true;
            }
            function keyUpHandler(e) {
                if(e.keyCode == 38)
                    upPressed = false;
                else if(e.keyCode == 40)
                    downPressed = false;
                else if(e.keyCode == 87)
                    wPressed = false;
                else if(e.keyCode == 83)
                    sPressed = false;
            }
            
            function drawBall() {
                ctx.beginPath();
                ctx.arc(x, y, ballRadius, 0, Math.PI*2);
                if (hitLeftPaddle == true)
                    ctx.fillStyle = "magenta";
                else if (hitRightPaddle == true)
                    ctx.fillStyle = "cyan";
                else
                    ctx.fillStyle = "white";
                ctx.fill();
                ctx.closePath();
            }
            function drawLeftPaddle() {
                if (paddleTweeningDone == false){
                    ctx.beginPath();
                    ctx.rect(leftStartX, leftPaddleY, leftPaddleWidth, leftPaddleHeight);
                    ctx.fillStyle = "magenta";
                    ctx.fill();
                    ctx.closePath();
                    leftStartX += (leftPaddleX - leftStartX) * .1; //tweening
                }
                else {
                    ctx.beginPath();
                    ctx.rect(leftPaddleX, leftPaddleY, leftPaddleWidth, leftPaddleHeight);
                    ctx.fillStyle = "magenta";
                    ctx.fill();
                    ctx.closePath();
                }
            }
            function drawRightPaddle() {
                if (paddleTweeningDone == false){
                    ctx.beginPath();
                    ctx.rect(rightStartX, rightPaddleY, rightPaddleWidth, rightPaddleHeight);
                    ctx.fillStyle = "cyan";
                    ctx.fill();
                    ctx.closePath();
                    rightStartX += (rightPaddleX - rightStartX) * .1; //tweening
                }
                else {
                    ctx.beginPath();
                    ctx.rect(rightPaddleX, rightPaddleY, rightPaddleWidth, rightPaddleHeight);
                    ctx.fillStyle = "cyan";
                    ctx.fill();
                    ctx.closePath();
                }
            }
            function drawDividor() {
                for (i; i < 600; i+=30) {
                    ctx.beginPath();
                    ctx.rect(canvas.width/2 - 2, rectY + i, 4, 15);
                    ctx.fillStyle = "rgb("+
                      Math.floor(Math.random()*256)+","+
                      Math.floor(Math.random()*256)+","+
                      Math.floor(Math.random()*256)+")";
                    ctx.fill();
                    ctx.closePath();
                }
                i = 0; //resets i so that the dotted line is printed in the same location each frame
            }
            function drawLeftScore() {
                ctx.font = "40px Arial";
                ctx.fillStyle = "magenta";
                ctx.fillText(leftScore, canvas.width/2 - 100, 45);
            }
            function drawRightScore() {
                ctx.font = "40px Arial";
                ctx.fillStyle = "cyan";
                ctx.fillText(rightScore, canvas.width/2 + 80, 45);
            }
            function goalDetection() { 
                //detects when left player scores
                if(x >= canvas.width){
                    leftScore++;
                    x = canvas.width/2; //reset ball position
                    y = canvas.height/3; //reset ball position
                    dy = 3; //reset ball y-speed
                    dx = -dx; //makes the ball start off in the direction of the player who last scored
                    hitRightPaddle = false; //resets ball color
                    hitLeftPaddle = false; //resets ball color
                    
                    if (leftScore == 3)
                        tripleSFX.play(); //plays a sound effect
                    else if (leftScore == 10)
                        winSFX.play(); //plays a sound effect
                    else {
                         goalSFX.play(); //plays sound effect
                         goalSFX.volume = 0.9;
                    }
                }
                //detects when right player scores
                if(x <= 0){
                    rightScore++;
                    x = canvas.width/2; //reset ball position
                    y = canvas.height/3; //reset ball position
                    dy = 3; //reset ball y-speed
                    dx = -dx; //makes the ball start off in the direction of the player who last scored
                    hitRightPaddle = false; //resets ball color
                    hitLeftPaddle = false; //resets ball color
                    
                    if (rightScore == 3)
                        tripleSFX.play(); //plays a sound effect
                    else if (rightScore == 10)
                        winSFX.play(); //plays a sound effect
                    else {
                        goalSFX.play(); //plays sound effect
                        goalSFX.volume = 0.9;
                    }
                }
            }

            function binSearch(k, A, low, high) { // search where the ball hits the paddle
                if (low > high) {
                    return -1;
                } else {
                    rv = 0;
                    middle = parseInt((low+high)/2);
                    next = middle + 1;
                    if (next >= A.length) {
                        next = A.length - 1;
                    }
                    if ( k >= A[middle] && k < A[next] ) {
                        rv = middle;
                    } else if ( k < A[middle] ) {
                        rv = binSearch( k, A, low, middle-1);
                    } else { // k > A[middle]
                        rv = binSearch( k, A, middle+1, high );
                    }
                    return rv;
                }
            }


            function collisionDetection() { //detects when the ball hits a wall or paddle and reacts accordingly
                
                var rightPaddlePos = [ rightPaddleY,
                    rightPaddleY + rightPaddleHeight/11, 
                    rightPaddleY + 2*rightPaddleHeight/11, 
                    rightPaddleY + 3*rightPaddleHeight/11,
                    rightPaddleY + 4*rightPaddleHeight/11,
                    rightPaddleY + 5*rightPaddleHeight/11,
                    rightPaddleY + 6*rightPaddleHeight/11,
                    rightPaddleY + 7*rightPaddleHeight/11,
                    rightPaddleY + 8*rightPaddleHeight/11,
                    rightPaddleY + 9*rightPaddleHeight/11,
                    rightPaddleY + 10*rightPaddleHeight/11,
                    rightPaddleY + rightPaddleHeight];

                var leftPaddlePos = [ leftPaddleY,
                    leftPaddleY + leftPaddleHeight/11, 
                    leftPaddleY + 2*leftPaddleHeight/11, 
                    leftPaddleY + 3*leftPaddleHeight/11,
                    leftPaddleY + 4*leftPaddleHeight/11,
                    leftPaddleY + 5*leftPaddleHeight/11,
                    leftPaddleY + 6*leftPaddleHeight/11,
                    leftPaddleY + 7*leftPaddleHeight/11,
                    leftPaddleY + 8*leftPaddleHeight/11,
                    leftPaddleY + 9*leftPaddleHeight/11,
                    leftPaddleY + 10*leftPaddleHeight/11,
                    leftPaddleY + leftPaddleHeight];

                var speedMultiplier = [ 4.5, 4, 3, 2.5, 1.5, 1/2, 1/2, 1.5, 2.5, 3, 4, 4.5];

                //makes ball bounce off the top and bottom walls
                if(y + dy > canvas.height - ballRadius || y + dy < ballRadius) {
                    dy = -dy;
                    wallBounceSFX.play();//plays sound effect
                }
                
                else if(x + dx >= rightPaddleX - ballRadius && x + dx <= rightPaddleX) { //when ball reaches right paddle x-axis
                    
                    r = binSearch( y, rightPaddlePos, 0, rightPaddlePos.length);
                    if (r != -1 ) {
                        speedx = speedMultiplier[r];
                        paddleBounceSFX.play();//plays sound effect
                        hitRightPaddle = true; 
                        hitLeftPaddle = false;
                        if(dy > 0) {
                            dy = 3; //reset dy speed
                            dy = dy * speedx;
                            dx = -dx;
                            if(r < 5){
                                dy = -dy;
                            }
                        }
                        else {
                            dy = -3; //reset dy speed
                            dy = dy * speedx;
                            dx = -dx;
                            if(r > 5){
                                dy = -dy;
                            }
                        }
                    }
                }
                
                else if(x + dx <= leftPaddleX + leftPaddleWidth + ballRadius && x + dx >= leftPaddleX) { //when ball reaches left paddle x-axis

                    r = binSearch( y, leftPaddlePos, 0, leftPaddlePos.length);
                    if (r != -1 ) {
                        speedx = speedMultiplier[r];
                        paddleBounceSFX.play();//plays sound effect
                        hitRightPaddle = false; 
                        hitLeftPaddle = true;
                        if(dy > 0) {
                            dy = 3; //reset dy speed
                            dy = dy * speedx;
                            dx = -dx;
                            if(r < 5){
                                dy = -dy;
                            }
                        }
                        else {
                            dy = -3; //reset dy speed
                            dy = dy * speedx;
                            dx = -dx;
                            if(r > 5){
                                dy = -dy;
                            }
                        }
                    }
                }
            }
            
            function draw() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                drawDividor();
                drawBall();
                drawLeftPaddle();
                drawRightPaddle();
                collisionDetection();
                goalDetection();
                drawLeftScore();
                drawRightScore();
                
                //determines a winner once a player reaches 10 points
                if(leftScore == 10){
                    alert("Left Player Wins!");
                    document.location.reload();
                }
                if(rightScore == 10){
                    alert("Right Player Wins!");
                    document.location.reload();
                }
                
                //defines paddle movement
                if(upPressed && rightPaddleY > 0)
                    rightPaddleY -= 10;
                if(downPressed && rightPaddleY < canvas.height - rightPaddleHeight)
                    rightPaddleY += 10;
                if(wPressed && leftPaddleY > 0)
                    leftPaddleY -= 10;
                if(sPressed && leftPaddleY < canvas.height - leftPaddleHeight)
                    leftPaddleY += 10;
                
                //determines when tweening of paddles is done so that the game can start
                if (leftStartX >= leftPaddleX - 1)
                    paddleTweeningDone = true;
                if (paddleTweeningDone == true){
                    x += dx;//moves the ball
                    y += dy;//moves the ball
                }
                
                requestAnimationFrame(draw);//causes the draw function to call itself repeatedly
            }
            draw();