/// <reference path="./scene.ts"/>

module paintableSet {
    
    import Scene = scene.Scene;

    export function PaintableSet(elements) {
            
        if ('paint' in this) {
            console.error('property \'paint\' already exists. Over-writing it.');
        }
        
        elements.paint = function (scene: Scene) {
            for (var el in this) {
                if (el !== 'paint') {
                    this[el].paint(scene);
                }
            }
        }
        
        return elements;
    }
}