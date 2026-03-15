import { Assets, Container, Sprite } from "pixi.js";


const NODE_SPRITE_URL = '/sprites/node.png';
const ARROW_SPRITE_URL = '/sprites/Arrow.png';

export class Node {

    static onMoveTo?: (target: Node) => void;

    private nextNodes: Node[] = [];
    readonly x : number;
    readonly y : number;
    private world : Container;
    
    constructor(world: Container,x: number, y: number) {
        this.x = x;
        this.y = y;
        this.world = world;
    }

    public addNode(node: Node): void {
        this.nextNodes.push(node);
    } 

    public async init(): Promise<void> {
        const nodeTexture = await Assets.load(NODE_SPRITE_URL);
        const nodeSprite = new Sprite(nodeTexture);
        nodeSprite.anchor.set(0.5);
        nodeSprite.x = this.x;
        nodeSprite.y = this.y;
        this.world.addChild(nodeSprite);
        nodeSprite.visible = false

        const arrowTexture = await Assets.load(ARROW_SPRITE_URL);
        for (const next of this.nextNodes) {
            const dx = next.x - this.x;
            const dy = next.y - this.y;
            const len = Math.sqrt(dx * dx + dy * dy) || 1;
            const dirX = (dx / len) * 64;
            const dirY = (dy / len) * 64;

            const arrowSprite = new Sprite(arrowTexture);
            arrowSprite.anchor.set(0.5);
            arrowSprite.x = this.x + dirX;
            arrowSprite.y = this.y + dirY;
            arrowSprite.rotation = Math.atan2(dy, dx);
            arrowSprite.eventMode = 'static';
            arrowSprite.cursor = 'pointer';
            arrowSprite.on('pointertap', () => Node.onMoveTo?.(next));
            this.world.addChild(arrowSprite);
        }
    }

    

}

export default Node;