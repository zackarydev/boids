import { IAIPlayer } from '..';
import IAIBrain from '../AIBrain';

type TransitionFunction = (brain: IAIBrain) => boolean;
type SetPlayerFunction = (player: IAIPlayer) => void;

class Transition {
    node: INode;
    transitionFunction: TransitionFunction;

    constructor(node: INode, transitionFunction: TransitionFunction) {
        this.node = node;
        this.transitionFunction = transitionFunction;
    }
}

export interface INode {
    name: string;
    transitionsTo: Transition[];
    setPlayerState: SetPlayerFunction;

    getTransition(brain: IAIBrain): Transition | undefined;
}

class Node implements INode {
    name: string;
    transitionsTo: Transition[];
    setPlayerState: SetPlayerFunction;

    constructor(stateName: string, setPlayerFunction: SetPlayerFunction) {
        this.name = stateName;
        this.setPlayerState = setPlayerFunction;

        this.transitionsTo = [];
    }

    addNode(node: Node, transitionFunction: TransitionFunction) {
        this.transitionsTo.push(new Transition(node, transitionFunction));
    }

    getTransition(brain: IAIBrain) {
        return this.transitionsTo.find((transition: Transition) => transition.transitionFunction(brain));
    }
}

/* ALL NODES */
const IdleNode = new Node('IDLE', (ai: IAIPlayer) => {
    ai.setIdle();
});
const AttackNode = new Node('ATTACK', (ai: IAIPlayer) => {
    ai.setAttackPlayer();
});
const StalkNode = new Node('STALK', (ai: IAIPlayer) => {
    ai.setStalkPlayer();
});

const FSMNodes = {
    IDLE: IdleNode,
    ATTACK: AttackNode,
    STALK: StalkNode,
};

export default FSMNodes;

/* IDLE TRANSITIONS */
// Idle to Attack
IdleNode.addNode(AttackNode, (brain: IAIBrain) => {
    return brain.playerIsVisible && brain.playerIsNear;
});

/* ATTACK TRANSITIONS */
// Attack to stalk
AttackNode.addNode(StalkNode, (brain: IAIBrain) => {
    return brain.health >= 15 && brain.playerIsVisible && brain.playerIsNear;
});
// Attack to idle
AttackNode.addNode(IdleNode, (brain: IAIBrain) => {
    return !brain.playerIsVisible || !brain.playerIsNear;
});

/* STALK TRANSITIONS */
// Stalk to idle
StalkNode.addNode(IdleNode, (brain: IAIBrain) => {
    debugger;
    return !brain.playerIsVisible || !brain.playerIsNear;
});
// Stalk to attack
StalkNode.addNode(AttackNode, (brain: IAIBrain) => {
    // if the player is still visible, but we have lower than 15 health, just attack
    return brain.health < 15;
});
