import domready from "domready"
import "./style.css"
import weightedRandom from "./weightedRandom";
import RTree from "rtree"


const PHI = (1 + Math.sqrt(5)) / 2;
const TAU = Math.PI * 2;
const DEG2RAD_FACTOR = TAU / 360;

const config = {
    width: 0,
    height: 0
};

/**
 * @type CanvasRenderingContext2D
 */
let ctx;
let canvas;

const colors = weightedRandom([
    0.8,"#000",
    2,"#ffb400",
    0.5,"#003cb3",
    1.5,"#fff"
])


domready(
    () => {

        canvas = document.getElementById("screen");
        ctx = canvas.getContext("2d");

        const width = (window.innerWidth) | 0;
        const height = (window.innerHeight) | 0;

        config.width = width;
        config.height = height;

        canvas.width = width;
        canvas.height = height;

        ctx.fillStyle = "#16161d";
        ctx.fillRect(0,0, width, height);

        const size = Math.max(width, height)/2;

        const rStep = size/50;

        const rtree = new RTree()

        for (let r = rStep*8; r < size + rStep; r += rStep)
        {
            let angle = 0;
            do
            {
                const slice = TAU/r + Math.random() * TAU  * 7/ r;
                const rnd = Math.random();
                const h = rStep * 0.5 + Math.pow(rnd,5) * rStep * 10


                const rect = {
                    x: angle * 1000,
                    y: r,
                    w: (slice + 10/r) * 1000,
                    h
                };
                const x0 = width/2 + Math.cos(angle) * r;
                const y0 = height/2 + Math.sin(angle) * r;
                const x1 = width/2 + Math.cos(angle) * (r + h);
                const y1 = height/2 + Math.sin(angle) * (r + h);


                angle += slice;

                const x2 = width/2 + Math.cos(angle) * r;
                const y2 = height/2 + Math.sin(angle) * r;
                const x3 = width/2 + Math.cos(angle) * (r + h);
                const y3 = height/2 + Math.sin(angle) * (r + h);

                angle += 10/r;

                if (!rtree.search(rect).length)
                {
                    ctx.fillStyle = colors();
                    ctx.beginPath();
                    ctx.moveTo(x0,y0);
                    ctx.lineTo(x1,y1);
                    ctx.lineTo(x3,y3);
                    ctx.lineTo(x2,y2);
                    ctx.fill();

                    rtree.insert(rect,rect)
                }
                else
                {
                    console.log("skip")
                }

            } while(angle < TAU)
        }


    }
);
