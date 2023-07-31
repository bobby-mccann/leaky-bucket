const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let lastDrop = performance.now();
let secondsPerDrop = 1;
let bucketCapacity = 10;
let bucket = 5;

let leakedDrops = [];
let overflowDrops = [];

function draw() {
    const bucketWidth = 100;
    const bucketHeight = 100;
    const bucketX = canvas.width / 2 - bucketWidth / 2;
    const bucketY = canvas.height / 2 - bucketHeight / 2;

    // Clear the canvas:
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the bucket's contents:
    ctx.lineWidth = 0;
    const fullness = bucket / bucketCapacity;
    ctx.fillStyle = 'blue';
    ctx.fillRect(bucketX, bucketY - fullness * bucketHeight,
        bucketWidth, bucketHeight * (bucket / bucketCapacity));

    // Use a 3px black line:
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'black';

    // Draw three lines to make a bucket:
    ctx.beginPath();
    ctx.moveTo(bucketX, bucketY - bucketHeight);
    ctx.lineTo(bucketX, bucketY);
    ctx.lineTo(bucketX + bucketWidth, bucketY);
    ctx.lineTo(bucketX + bucketWidth, bucketY - bucketHeight);
    ctx.stroke();

    // Draw the leaked drops:
    ctx.fillStyle = 'blue';
    for (let i = 0; i < leakedDrops.length; i++) {
        const elapsedSeconds = (performance.now() - leakedDrops[i]) / 1000;
        const y = bucketY + elapsedSeconds * bucketHeight;
        // Draw a circle for each drop:
        ctx.beginPath();
        ctx.arc(bucketX + bucketWidth / 2, y, 5, 0, 2 * Math.PI);
        ctx.fill();
    }

    // Draw the overflow drops:
    ctx.fillStyle = 'red';
    for (let i = 0; i < overflowDrops.length; i++) {
        const elapsedSeconds = (performance.now() - overflowDrops[i]) / 1000;
        const y = bucketY - bucketHeight + elapsedSeconds * bucketHeight;
        // Draw a circle for each drop:
        ctx.beginPath();
        ctx.arc(bucketX - bucketWidth / 2, y, 5, 0, 2 * Math.PI);
        ctx.fill();
    }
}

function update() {
    if (bucket > 0) {
        const now = performance.now();
        const elapsedSeconds = (now - lastDrop) / 1000;
        if (elapsedSeconds > secondsPerDrop) {
            bucket--;
            leakedDrops.push(now);
            lastDrop = now;
        }
    }
    draw();

    requestAnimationFrame(update);
}

function addToBucket(numberOfDrops) {
    bucket += numberOfDrops;
    while (bucket > bucketCapacity) {
        overflowDrops.push(performance.now());
        bucket -= 1;
    }
}

update();