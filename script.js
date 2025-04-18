const canvas = document.getElementById("tspCanvas");
        const ctx = canvas.getContext("2d");
        let cities = [];
        let distances = [];
        let tour = [];
        let totalDistance = 0;

        function generateDistanceInputs() {
            let num = parseInt(document.getElementById("numCities").value);
            if (num < 2) {
                alert("Please enter at least 2 cities.");
                return;
            }

            cities = [];
            distances = Array.from({ length: num }, () => Array(num).fill(0));
            document.getElementById("distanceInputs").innerHTML = "";
            
            for (let i = 0; i < num; i++) {
                cities.push({ x: Math.random() * (canvas.width - 100) + 50, y: Math.random() * (canvas.height - 100) + 50 });
            }

            let inputHTML = "<strong>Enter Distances:</strong><br>";
            for (let i = 0; i < num; i++) {
                for (let j = i + 1; j < num; j++) {
                    inputHTML += `Distance between city ${i} and city ${j}: 
                        <input type='number' class='distance-input' id='dist_${i}_${j}' min='0'><br>`;
                }
            }
            document.getElementById("distanceInputs").innerHTML = inputHTML;
            document.getElementById("startButton").style.display = "block";
        }

        function startTSP() {
            let num = parseInt(document.getElementById("numCities").value);
            for (let i = 0; i < num; i++) {
                for (let j = i + 1; j < num; j++) {
                    let dist = parseFloat(document.getElementById(`dist_${i}_${j}`).value) || 0;
                    distances[i][j] = distances[j][i] = dist;
                }
            }
            tour = solveTSP();
            drawTSPPath();
        }

        function solveTSP() {
            let visited = new Array(cities.length).fill(false);
            let path = [0];
            visited[0] = true;
            totalDistance = 0;

            for (let i = 1; i < cities.length; i++) {
                let last = path[path.length - 1];
                let nearest = -1;
                let minDist = Infinity;

                for (let j = 0; j < cities.length; j++) {
                    if (!visited[j] && distances[last][j] < minDist) {
                        minDist = distances[last][j];
                        nearest = j;
                    }
                }

                path.push(nearest);
                visited[nearest] = true;
                totalDistance += minDist;
            }

            totalDistance += distances[path[path.length - 1]][0];
            path.push(0); 
            return path;
        }

        function drawTSPPath() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < tour.length - 1; i++) {
                let city1 = cities[tour[i]];
                let city2 = cities[tour[i + 1]];
                
                ctx.strokeStyle = (i === 0 || i === tour.length - 2) ? "red" : "black";
                ctx.lineWidth = (i === 0 || i === tour.length - 2) ? 3 : 2;
                ctx.beginPath();
                ctx.moveTo(city1.x, city1.y);
                ctx.lineTo(city2.x, city2.y);
                ctx.stroke();
            }

            for (let i = 0; i < cities.length; i++) {
                ctx.fillStyle = "blue";
                ctx.beginPath();
                ctx.arc(cities[i].x, cities[i].y, 8, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = "white";
                ctx.font = "14px Arial";
                ctx.fillText(i, cities[i].x - 4, cities[i].y + 4);
            }

            document.getElementById("shortestDistance").innerHTML = `Shortest Path Distance: <span style='color: red;'>${totalDistance}</span>`;
        }