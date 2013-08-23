/// <reference path="./scene.ts"/>

module foo {
    
    import Scene = scene.Scene;

    export class PaintableSet {
        
        private elements = {};
        
        constructor (elements) {
            this.elements = elements;
        }
        
        public paint (scene: Scene) {
            for (var el in this.elements) {
                this.elements[el].paint(scene);
            }
        }
    }
};